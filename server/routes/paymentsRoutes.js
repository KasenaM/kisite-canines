const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPayment,
  getUserPayments,
  getAllPayments
} = require("../controllers/paymentController");


router.get("/", authMiddleware, getUserPayments);
router.post("/", authMiddleware, createPayment);


router.get("/all", authMiddleware, getAllPayments);

module.exports = router;
