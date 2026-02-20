
// models/Activity.js
const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    actionType: {
      type: String,
      enum: [
         "Booking Created",
         "Booking Cancelled",
         "Booking Rescheduled",
         "Service Cancelled",
        "Service Rescheduled",
      ],
      required: true,
      index: true,
    },

    meta: {
      type: Object,
      default: {}, 
    },

    description: {
      type: String,
      default: "",
    },

    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

/* ================= INDEXES FOR FAST QUERIES ================= */
activitySchema.index({ userId: 1, createdAt: -1 });
activitySchema.index({ actionType: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
