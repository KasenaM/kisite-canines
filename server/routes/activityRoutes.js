const express = require("express");
const router = express.Router();
const activityController = require("../controllers/activityController");


router.post("/", activityController.logActivity);


router.get("/", activityController.getAllActivities);


router.get("/user/:userId", activityController.getUserActivities);


router.get("/:id", activityController.getActivityById);


router.delete("/:id", activityController.deleteActivity);

module.exports = router;
