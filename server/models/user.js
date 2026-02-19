const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // --- Basic Info ---
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    
    // --- Contact & Location ---
    phone: { 
      type: String, 
      required: true, 
      trim: true 
    },
    address: { 
      type: String, 
      required: true, 
      trim: true 
    },

    // --- Emergency Contact Info ---
    emergencyName: { 
      type: String, 
      required: true, 
      trim: true 
    },
    emergencyRelationship: { 
      type: String, 
      required: true, 
      trim: true 
    },
    emergencyPhone: { 
      type: String, 
      required: true, 
      trim: true 
    },

   
    dogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dog",
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.models.User || mongoose.model("User", userSchema);