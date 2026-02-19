// controllers/serviceInstancesController.js
const ServiceInstance = require("../models/ServiceInstances");
const mongoose = require("mongoose");

/* ================= CREATE SERVICE INSTANCE ================= */
exports.createServiceInstance = async (req, res) => {
  try {
    const serviceData = req.body;

    const serviceInstance = await ServiceInstance.create(serviceData);

    res.status(201).json({
      success: true,
      message: "Service instance created successfully",
      data: serviceInstance,
    });
  } catch (error) {
    console.error("Create ServiceInstance Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET SERVICE INSTANCE BY ID ================= */
exports.getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(400).json({ success: false, error: "Invalid ID" });

    const serviceInstance = await ServiceInstance.findById(id)
      .populate("bookingId")
      .populate("dogId")
      .populate("userId");

    if (!serviceInstance)
      return res.status(404).json({ success: false, error: "Not found" });

    res.json({ success: true, data: serviceInstance });
  } catch (error) {
    console.error("Get ServiceInstance Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET ALL SERVICES (ADMIN) ================= */
exports.getAllServices = async (req, res) => {
  try {
    const services = await ServiceInstance.find()
      .populate("bookingId")
      .populate("dogId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Get All Services Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET SERVICES FOR A USER ================= */
exports.getUserServices = async (req, res) => {
  try {
    const { userId } = req.params;

    const services = await ServiceInstance.find({ userId })
      .populate("bookingId")
      .populate("dogId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Get User Services Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= GET SERVICES FOR A DOG ================= */
exports.getDogServices = async (req, res) => {
  try {
    const { dogId } = req.params;

    const services = await ServiceInstance.find({ dogId })
      .populate("bookingId")
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: services });
  } catch (error) {
    console.error("Get Dog Services Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= UPDATE SERVICE INSTANCE ================= */
exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const service = await ServiceInstance.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!service)
      return res.status(404).json({ success: false, error: "Service not found" });

    res.json({ success: true, message: "Service updated", data: service });
  } catch (error) {
    console.error("Update Service Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

/* ================= DELETE SERVICE INSTANCE ================= */
exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await ServiceInstance.findByIdAndDelete(id);

    if (!service)
      return res.status(404).json({ success: false, error: "Service not found" });

    res.json({ success: true, message: "Service instance deleted" });
  } catch (error) {
    console.error("Delete Service Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
