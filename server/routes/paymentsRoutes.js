const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPayment,
  getUserPayments,
  getAllPayments
} = require("../controllers/paymentController");

// Protect ALL user routes
router.get("/", authMiddleware, getUserPayments);
router.post("/", authMiddleware, createPayment);

// Admin route (optional)
router.get("/all", authMiddleware, getAllPayments);

module.exports = router;
