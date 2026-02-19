// controllers/analyticsController.js

const ServiceBooking = require("../models/Booking");
const Service = require("../models/ServiceInstances");
const Payment = require("../models/Payment");
const Dog = require("../models/Dog");
const Activity = require("../models/Activity");
const mongoose = require("mongoose");

/* ================= GET CLIENT DASHBOARD ANALYTICS ================= */
exports.getUserAnalytics = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res.status(400).json({ message: "userId is required" });

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid userId" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    /* ================= TOTAL DOGS ================= */
    const totalDogs = await Dog.countDocuments({
      ownerId: userObjectId,
    });

    /* ================= TOTAL SERVICES ================= */
    const totalServices = await Service.countDocuments({
      userId: userObjectId,
    });

    /* ================= CANCELLED SERVICES ================= */
    const cancelledServices = await Service.countDocuments({
      userId: userObjectId,
      serviceStatus: "Cancelled",
    });

    /* ================= UPCOMING APPOINTMENTS ================= */
    const upcomingAppointments = await Service.countDocuments({
      userId: userObjectId,
      serviceStatus: { $in: ["Scheduled", "Rescheduled"] },
      serviceDate: { $gte: new Date() },
    });

    /* ================= TOTAL AMOUNT SPENT ================= */
    const payments = await Payment.find({
      user: userObjectId,
      status: "Success",
    });

    const totalSpent = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    /* ================= MOST USED SERVICE TYPE ================= */
    const mostUsedService = await Service.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$serviceName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    /* ================= SERVICE COMPLETION RATE ================= */
    const totalDone = await Service.countDocuments({
      userId: userObjectId,
      serviceStatus: "Done",
    });

    const completionRate =
      totalServices > 0
        ? ((totalDone / totalServices) * 100).toFixed(2)
        : "0.00";

    /* ================= CANCELLATION RATE ================= */
    const cancellationRate =
      totalServices > 0
        ? ((cancelledServices / totalServices) * 100).toFixed(2)
        : "0.00";

    /* ================= AVERAGE SPEND PER BOOKING ================= */
    const bookings = await ServiceBooking.find({
      user: userObjectId,
    });

    const avgSpendPerBooking =
      bookings.length > 0
        ? (
            bookings.reduce(
              (sum, b) => sum + (b.totalAmount || 0),
              0
            ) / bookings.length
          ).toFixed(2)
        : "0.00";

    /* ================= UPCOMING REVENUE (UNPAID BOOKINGS) ================= */
    const unpaidBookings = await ServiceBooking.find({
      user: userObjectId,
      paymentStatus: "Unpaid",
      status: { $ne: "Cancelled" },
    });

    const upcomingRevenue = unpaidBookings.reduce(
      (sum, b) => sum + (b.totalAmount || 0),
      0
    );

    /* ================= DOGS WITH MOST SERVICES ================= */
    const dogsMostServices = await Service.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$dogId",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "dogs",
          localField: "_id",
          foreignField: "_id",
          as: "dogInfo",
        },
      },
      { $unwind: "$dogInfo" },
      {
        $project: {
          dogId: "$dogInfo._id",
          dogName: "$dogInfo.name",
          breed: "$dogInfo.breed",
          count: 1,
        },
      },
    ]);

    /* ================= LOYALTY LEVEL ================= */
    let loyaltyLevel = "Bronze";
    if (totalSpent > 50000) loyaltyLevel = "Gold";
    else if (totalSpent > 20000) loyaltyLevel = "Silver";

    /* ================= REAL RECENT ACTIVITIES (FIXED) ================= */
    const recentActivities = await Activity.find({
      userId: userObjectId,
    })
      .sort({ createdAt: -1 })
      .limit(5)
      
      .select("actionType description relatedId createdAt");

    /* ================= RESPONSE ================= */
    res.status(200).json({
      totalDogs,
      totalServices,
      cancelledServices,
      upcomingAppointments,
      totalSpent,
      mostUsedService:
        mostUsedService.length > 0
          ? mostUsedService[0]._id
          : null,
      completionRate,
      cancellationRate,
      avgSpendPerBooking,
      upcomingRevenue,
      dogsMostServices,
      loyaltyLevel,
      recentActivities,
    });

  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= GET ADMIN DASHBOARD ANALYTICS ================= */
exports.getAdminAnalytics = async (req, res) => {
  try {
    const totalUsers = await Dog.distinct("ownerId");
    const totalDogs = await Dog.countDocuments();
    const totalServices = await Service.countDocuments();

    const cancelledServices = await Service.countDocuments({
      serviceStatus: "Cancelled",
    });

    const upcomingAppointments = await Service.countDocuments({
      serviceStatus: { $in: ["Scheduled", "Rescheduled"] },
      serviceDate: { $gte: new Date() },
    });

    const payments = await Payment.find({
      status: "Success",
    });

    const totalSpent = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    const mostUsedService = await Service.aggregate([
      {
        $group: {
          _id: "$serviceName",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    /* ================= ADMIN RECENT ACTIVITIES (NEW) ================= */
    const recentActivities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("userId", "name email")
      .select("actionType description userId createdAt");

    res.status(200).json({
      totalUsers: totalUsers.length,
      totalDogs,
      totalServices,
      cancelledServices,
      upcomingAppointments,
      totalSpent,
      mostUsedService:
        mostUsedService.length > 0
          ? mostUsedService[0]._id
          : null,
      recentActivities,
    });

  } catch (error) {
    console.error("Admin Analytics Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


/* ================= GET USER ANALYTICS BY DATE RANGE ================= */
exports.getUserAnalyticsByDate = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!mongoose.Types.ObjectId.isValid(userId))
      return res.status(400).json({ message: "Invalid userId" });

    if (!startDate || !endDate)
      return res
        .status(400)
        .json({ message: "startDate and endDate are required" });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const totalServices = await Service.countDocuments({
      userId: userObjectId,
      createdAt: { $gte: start, $lte: end },
    });

    const cancelledServices = await Service.countDocuments({
      userId: userObjectId,
      serviceStatus: "Cancelled",
      createdAt: { $gte: start, $lte: end },
    });

    const upcomingAppointments = await Service.countDocuments({
      userId: userObjectId,
      serviceStatus: { $in: ["Scheduled", "Rescheduled"] },
      serviceDate: { $gte: new Date() },
    });

    const payments = await Payment.find({
      user: userObjectId,
      status: "Success",
      createdAt: { $gte: start, $lte: end },
    });

    const totalSpent = payments.reduce(
      (sum, p) => sum + (p.amount || 0),
      0
    );

    /* ================= DATE RANGE ACTIVITIES (NEW) ================= */
    const activities = await Activity.find({
      userId: userObjectId,
      createdAt: { $gte: start, $lte: end },
    })
      .sort({ createdAt: -1 })
      .select("actionType description createdAt");

    res.status(200).json({
      totalServices,
      cancelledServices,
      upcomingAppointments,
      totalSpent,
      activities,
    });

  } catch (error) {
    console.error("Analytics by Date Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
