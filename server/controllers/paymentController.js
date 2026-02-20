const Payment = require("../models/Payment");
const ServiceBooking = require("../models/Booking");


/* ================= CREATE PAYMENT ================= */
exports.createPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    if (!bookingId || !paymentMethod) {
      return res.status(400).json({
        message: "Booking ID and payment method are required.",
      });
    }

    const booking = await ServiceBooking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "Paid") {
      return res.status(400).json({ message: "Booking is already paid." });
    }

    const newPayment = new Payment({
      booking: booking._id,
      user: req.userId, 
      amount: booking.totalAmount,
      status: "Success",
      paymentMethod,
      paidAt: new Date(),
    });

    await newPayment.save();

    booking.paymentStatus = "Paid";
    await booking.save();

    res.status(201).json({
      message: "Payment successful",
      payment: newPayment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

/* ================= GET USER PAYMENTS ================= */
exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.userId })
      .populate("booking")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};


/* ================= GET ALL PAYMENTS (ADMIN) ================= */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("booking")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
