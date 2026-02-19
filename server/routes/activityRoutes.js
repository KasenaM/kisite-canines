const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");

// Create a new activity
router.post("/", activityController.logActivity);

// Get all activities (admin view)
router.get("/", activityController.getAllActivities);

// Get recent activities for a specific user
router.get("/user/:userId", activityController.getUserActivities);

// Get activity by ID
router.get("/:id", activityController.getActivityById);

// Delete activity by ID (admin)
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
