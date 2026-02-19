const mongoose = require("mongoose");

/* ================= SERVICE SCHEMA ================= */
const serviceSchema = new mongoose.Schema({
  service: {
    type: String,
    required: true,
    enum: ["Training", "Boarding", "Grooming"],
  },

  packageName: { type: String, required: true },
  price: { type: Number, required: true },

  
  serviceDate: { type: Date },
  startDate: { type: Date },
  endDate: { type: Date },

  locationType: String,
  pickupPreference: String,
  notes: { type: String, required: true },

  serviceStatus: {
    type: String,
    enum: ["Scheduled", "Rescheduled", "Cancelled", "Done"],
    default: "Scheduled",
  },

  progress: {
    type: String,
    enum: [
      "Not Done",
      "Awaiting Arrival",
      "In Progress",
      "Ready for Pickup",
      "Completed",
      "Terminated",
    ],
    default: "Not Done",
  },

  checkInAt: Date,
  checkOutAt: Date,
  startedAt: Date,
  completedAt: Date,
  cancelledAt: Date,
});

/* ================= DOG BOOKING ================= */
const dogBookingSchema = new mongoose.Schema({
  dogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dog",
    required: true,
  },
  dogName: String,
  services: [serviceSchema],
});

/* ================= MAIN BOOKING ================= */
const serviceBookingSchema = new mongoose.Schema(
  {
    referenceCode: {
      type: String,
      unique: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    phone: { type: String, required: true },
    address: { type: String, required: true },

    bookings: [dogBookingSchema],

    totalAmount: { type: Number, required: true },

    pickupPreference: String,

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid", "Refunded", "Partially Paid"],
      default: "Unpaid",
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "bookings",
  }
);

/* ================= INDEXES FOR ANALYTICS ================= */
serviceBookingSchema.index({ createdAt: -1 });
serviceBookingSchema.index({ user: 1, status: 1 });


/* ================= BOOKING REFERENCE GENERATOR ================= */
async function generateReferenceCode() {
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `KS-${year}-${randomNumber}`;
}

/* ================= TRAINING DURATION ENGINE ================= */
function calculateTrainingEndDate(startDate, packageName) {
  if (!startDate) return null;
  const match = packageName?.match(/(\d+)/);
  if (!match) return null;
  const weeks = parseInt(match[1]);
  const d = new Date(startDate);
  d.setDate(d.getDate() + weeks * 7);
  return d;
}

/* ================= PROGRESS ENGINE ================= */
function updateServiceProgress(service) {
  const now = new Date();

  if (service.serviceStatus === "Rescheduled") return;

  if (service.serviceStatus === "Cancelled") {
    service.progress = "Terminated";
    service.cancelledAt = new Date();
    return;
  }

  if (service.service === "Training" || service.service === "Boarding") {
    const end = service.endDate ? new Date(service.endDate) : null;

    if (service.checkOutAt) {
      service.progress = "Completed";
      service.serviceStatus = "Done";
    } else if (end && now > end) {
      service.progress = "Ready for Pickup";
    } else if (service.checkInAt) {
      service.progress = "In Progress";
    } else {
      service.progress = "Awaiting Arrival";
    }
  }

  if (service.service === "Grooming") {
    const gDate = service.serviceDate;

    if (service.completedAt) {
      service.progress = "Completed";
      service.serviceStatus = "Done";
    } else if (gDate && gDate.toDateString() === now.toDateString()) {
      service.progress = "In Progress";
    } else {
      service.progress = "Not Done";
    }
  }
}

/* ================= PAYMENT STATUS GUARD ================= */
function enforcePaymentRules(booking) {
  if (booking.status === "Pending" || booking.status === "Cancelled") {
    booking.paymentStatus = "Unpaid";
  }
}

/* ================= AUTO STATUS DERIVATION ================= */
function deriveBookingStatus(booking) {
  let totalServices = 0;
  let activeServices = 0;
  let finishedServices = 0;
  let hasCancelledService = false;

  booking.bookings.forEach((dog) => {
    dog.services.forEach((svc) => {
      totalServices++;

      if (svc.serviceStatus === "Done") {
        finishedServices++;
        activeServices++;
      } else if (svc.serviceStatus !== "Cancelled") {
        activeServices++;
      } else {
        hasCancelledService = true;
      }
    });
  });

  if (booking.status === "Confirmed" && hasCancelledService) {
    booking.status = "Pending";
  }

  if (booking.status === "Pending" && activeServices === 0 && totalServices > 0) {
    booking.status = "Cancelled";
  }

  const allServicesDone =
    finishedServices === totalServices && totalServices > 0;
  const isPaid = booking.paymentStatus === "Paid";

  if (allServicesDone && isPaid && booking.status !== "Cancelled") {
    booking.status = "Completed";
  } else if (
    booking.status === "Completed" &&
    (!allServicesDone || !isPaid)
  ) {
    booking.status = "Confirmed";
  }
}

/* ================= BOOKING CANCEL CASCADE ================= */
function applyBookingCancellation(booking) {
  if (booking.status === "Cancelled") {
    booking.totalAmount = 0;

    booking.bookings.forEach((dog) => {
      dog.services.forEach((svc) => {
        svc.serviceStatus = "Cancelled";
        svc.progress = "Terminated";
        svc.cancelledAt = new Date();
      });
    });
  }
}

/* ================= LIFECYCLE HOOK ================= */
serviceBookingSchema.pre("save", async function (next) {
  try {
    if (this.isNew && !this.referenceCode) {
      let unique = false;
      let newCode;

      while (!unique) {
        newCode = await generateReferenceCode();
        const existing = await mongoose.models.ServiceBooking.findOne({
          referenceCode: newCode,
        });

        if (!existing) unique = true;
      }

      this.referenceCode = newCode;
    }

    this.bookings.forEach((dog) => {
      dog.services.forEach((svc) => {
        if (svc.service === "Training" && svc.startDate && !svc.endDate) {
          svc.endDate = calculateTrainingEndDate(
            svc.startDate,
            svc.packageName
          );
        }
        updateServiceProgress(svc);
      });
    });

    deriveBookingStatus(this);
    applyBookingCancellation(this);
    enforcePaymentRules(this);

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);
