// models/ServiceInstances.js
const mongoose = require("mongoose");

const serviceInstanceSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBooking",
      required: true,
      index: true, // for analytics
    },

    dogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Dog",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    serviceName: {
      type: String,
      enum: ["Training", "Boarding", "Grooming"],
      required: true,
      index: true,
    },

    packageName: { type: String, required: true },
    price: { type: Number, required: true },

    serviceStatus: {
      type: String,
      enum: ["Scheduled", "Rescheduled", "Cancelled", "Done"],
      default: "Scheduled",
      index: true,
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

    serviceDate: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    checkInAt: { type: Date },
    checkOutAt: { type: Date },
    completedAt: { type: Date },
    cancelledAt: { type: Date },

    locationType: String,
    pickupPreference: String,
    notes: { type: String, default: "" },
  },
  { timestamps: true, collection: "serviceinstances" }
);

/* ================= INDEXES FOR ANALYTICS ================= */
serviceInstanceSchema.index({ serviceName: 1 });
serviceInstanceSchema.index({ userId: 1, serviceStatus: 1 });
serviceInstanceSchema.index({ dogId: 1, serviceStatus: 1 });
serviceInstanceSchema.index({ createdAt: -1 });

module.exports = mongoose.model("ServiceInstance", serviceInstanceSchema);
