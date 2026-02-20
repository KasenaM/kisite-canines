// routes/analyticsRoutes.js
const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");


router.get("/user/:userId", analyticsController.getUserAnalytics);



router.get("/admin", analyticsController.getAdminAnalytics);


router.get("/user/:userId/date-range", analyticsController.getUserAnalyticsByDate);

module.exports = router;
