// controllers/activityController.js
const Activity = require("../models/Activity");
const mongoose = require("mongoose");

/* ================= CREATE NEW ACTIVITY ================= */
exports.logActivity = async (req, res) => {
  try {
    const { userId, actionType, meta = {}, description = "" } = req.body;

    if (!userId || !actionType) {
      return res.status(400).json({ message: "userId and actionType are required" });
    }

    const activity = await Activity.create({
      userId,
      actionType,
      meta,
      description,
    });

    res.status(201).json({
      message: "Activity logged successfully",
      activity,
    });
  } catch (error) {
    console.error("Activity Log Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= GET ALL ACTIVITIES (ADMIN) ================= */
exports.getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Get All Activities Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET RECENT ACTIVITIES FOR USER ================= */
exports.getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const activities = await Activity.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    console.error("Get User Activities Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET ACTIVITY BY ID ================= */
exports.getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, error: "Invalid ID" });

    const activity = await Activity.findById(id);

    if (!activity)
      return res.status(404).json({ success: false, error: "Activity not found" });

    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    console.error("Get Activity By ID Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= DELETE ACTIVITY ================= */
exports.deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await Activity.findByIdAndDelete(id);

    if (!activity)
      return res.status(404).json({ success: false, error: "Activity not found" });

    res.status(200).json({ success: true, message: "Activity deleted" });
  } catch (error) {
    console.error("Delete Activity Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
