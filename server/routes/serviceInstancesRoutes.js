const express = require("express");
const router = express.Router();
const serviceInstancesController = require("../controllers/serviceInstancesController");


router.post("/", serviceInstancesController.createServiceInstance);


router.get("/", serviceInstancesController.getAllServices);


router.get("/user/:userId", serviceInstancesController.getUserServices);


router.get("/dog/:dogId", serviceInstancesController.getDogServices);


router.get("/:id", serviceInstancesController.getServiceById);


router.put("/:id", serviceInstancesController.updateService);


router.delete("/:id", serviceInstancesController.deleteService);

module.exports = router;
