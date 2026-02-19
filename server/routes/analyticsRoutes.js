// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

/* ================= USER DASHBOARD ANALYTICS ================= */
router.get("/user/:userId", analyticsController.getUserAnalytics);

/* ================= ADMIN DASHBOARD ANALYTICS ================= */
// Ensure getAdminAnalytics exists in analyticsController
router.get("/admin", analyticsController.getAdminAnalytics);

/* ================= OPTIONAL: USER ANALYTICS BY DATE RANGE ================= */
// Ensure getUserAnalyticsByDate exists in analyticsController
router.get("/user/:userId/date-range", analyticsController.getUserAnalyticsByDate);

module.exports = router;
