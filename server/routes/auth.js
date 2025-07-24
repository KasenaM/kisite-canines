// server/routes/auth.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");


const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register new user
// @access  Public
router.post("/signup", verifyRecaptcha,async (req, res) => {
  console.log("📨 Received signup:", req.body);
  try {
    const { name, email, password } = req.body;

    // 1. Check if email already exists
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const user = await User.create({ name, email, password: hashedPassword });

    // 4. Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // 5. Respond with token and user
    res.status(201).json({
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/auth/login
// @desc    Login existing user
// @access  Public
router.post("/login",verifyRecaptcha, async (req, res) => {
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

    // 4. Respond with token and user
    res.status(200).json({
      user: { name: user.name, email: user.email },
      token,
    });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
});


module.exports = router;
