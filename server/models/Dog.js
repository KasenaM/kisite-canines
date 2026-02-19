const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, 
      index: true,     
    },

    source: {
      type: String,
      enum: ["client", "shop"],
      required: true,
      default: "shop",
    },

    name: {
      type: String,
      required: true,
      trim: true,
      index: true, 
    },

    breed: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    age: {
      type: String,
      required: true,
      trim: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true,
      index: true, 
    },

    image: {
      type: String,
      required: true,
    },

    
    totalServices: {
      type: Number,
      default: 0,
    },

    totalSpent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);


dogSchema.index({ ownerId: 1, breed: 1 });

module.exports = mongoose.model("Dog", dogSchema);
