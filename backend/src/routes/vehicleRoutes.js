//vehicleRoutes.js

const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");

// Vehicle Routes
router.get("/", vehicleController.getAllVehicles);
router.post("/", vehicleController.addVehicle);
router.delete("/:id", vehicleController.deleteVehicle);

module.exports = router;
