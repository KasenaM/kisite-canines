// server/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/signup", verifyRecaptcha, async (req, res) => {
  console.log("📨 Received signup:", req.body);
  try {
    const { 
      name, 
      email, 
      password, 
      phone, 
      address, 
      emergencyName, 
      emergencyRelationship, 
      emergencyPhone 
    } = req.body;

    // 1. Check if email already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user with all fields
    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      phone,
      address,
      emergencyName,
      emergencyRelationship,
      emergencyPhone
    });

    // 4. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // 5. Respond with token and full user object (excluding password)
    res.status(201).json({
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        phone: user.phone,
        address: user.address,
        emergencyName: user.emergencyName,
        emergencyRelationship: user.emergencyRelationship,
        emergencyPhone: user.emergencyPhone
      },
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});


router.post("/login", verifyRecaptcha, async (req, res) => {
  console.log("📨 Received login:", req.body);
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // 3. Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // 4. Respond with token and full user object
    res.status(200).json({
      user: { 
        id: user._id,
        name: user.name, 
        email: user.email,
        phone: user.phone,
        address: user.address,
        emergencyName: user.emergencyName,
        emergencyRelationship: user.emergencyRelationship,
        emergencyPhone: user.emergencyPhone
      },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/auth/me

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
});

// @route   PUT /api/auth/profile

router.put("/profile", authMiddleware, async (req, res) => {
  console.log("📨 Received profile update for user:", req.userId);
  try {
    const {
      name,
      email,
      phone,
      address,
      emergencyName,
      emergencyRelationship,
      emergencyPhone,
      password 
    } = req.body;

    // 1. Find the user
    let user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // 2. If email is being changed, check if new email is already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }

    // 3. Update basic fields if provided
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (emergencyName) user.emergencyName = emergencyName;
    if (emergencyRelationship) user.emergencyRelationship = emergencyRelationship;
    if (emergencyPhone) user.emergencyPhone = emergencyPhone;

    // 4. Handle password update if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // 5. Save the updated user
    const updatedUser = await user.save();

    // 6. Return updated user (excluding password)
    res.status(200).json({
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      emergencyName: updatedUser.emergencyName,
      emergencyRelationship: updatedUser.emergencyRelationship,
      emergencyPhone: updatedUser.emergencyPhone
    });
  } catch (err) {
    console.error("❌ Profile update error:", err.message);
    res.status(500).json({ message: "Server error during profile update" });
  }
});

module.exports = router;