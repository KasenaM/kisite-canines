const express = require("express");
const router = express.Router();
const ContactMessage = require("../models/ContactMessage");
const {
  validateContactRequest,
  limitContactSubmissions
} = require("../middleware/contactMiddleware.js");
const verifyRecaptcha = require("../middleware/verifyRecaptcha");

router.get("/ping", (req, res) => {
  res.status(200).send("pong");
});




router.post("/", verifyRecaptcha,limitContactSubmissions, validateContactRequest, async (req, res) => {

  console.log("📩 Received contact payload:", req.body);
 

  try {
    const { fullName, email, phone, subject, message } = req.body;

    const newMessage = new ContactMessage({
      fullName,
      email,
      phone,
      subject,
      message
    });

    await newMessage.save();
    res.status(201).json({ message: "Message submitted successfully." });
  } catch (err) {
    console.error("Error saving contact message:", err.message);
    res.status(500).json({ message: "Something went wrong on the server." });
  }
});

module.exports = router;
