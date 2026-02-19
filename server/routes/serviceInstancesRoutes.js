const express = require("express");
const router = express.Router();
const serviceInstancesController = require("../controllers/serviceInstancesController");

// Create a new service instance (admin)
router.post("/", serviceInstancesController.createServiceInstance);

// Get all service instances (admin)
router.get("/", serviceInstancesController.getAllServices);

// Get services for a specific user
router.get("/user/:userId", serviceInstancesController.getUserServices);

// Get services for a specific dog
router.get("/dog/:dogId", serviceInstancesController.getDogServices);

// Get service by ID
router.get("/:id", serviceInstancesController.getServiceById);

// Update service by ID (admin)
router.put("/:id", serviceInstancesController.updateService);

// Delete service by ID (admin)
router.delete("/:id", serviceInstancesController.deleteService);

module.exports = router;
