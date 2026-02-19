const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceBooking",
      required: true,
      index: true, // for analytics & queries
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // total spent per user
    },
    amount: { type: Number, required: true },

    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
      index: true, // for completion/cancellation rate metrics
    },

    paymentMethod: {
      type: String,
      enum: ["M-Pesa", "Visa", "MasterCard", "PayPal", null],
      default: null,
    },

    paidAt: Date,

    referenceCode: { type: String, unique: true },

    // Optional field for analytics (like refunds or notes)
    notes: { type: String, default: "" },
    isRefunded: { type: Boolean, default: false },
  },
  { timestamps: true }
);

/* ================= PAYMENT REFERENCE GENERATOR ================= */
paymentSchema.pre("save", async function (next) {
  if (this.isNew && !this.referenceCode) {
    let unique = false;
    while (!unique) {
      const year = new Date().getFullYear();
      const randomNumber = Math.floor(100000 + Math.random() * 900000);
      const newCode = `PAY-${year}-${randomNumber}`;
      const existing = await mongoose.models.Payment.findOne({ referenceCode: newCode });
      if (!existing) {
        this.referenceCode = newCode;
        unique = true;
      }
    }
  }
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
