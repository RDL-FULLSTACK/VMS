// controllers/vehicleController.js
const Vehicle = require("../models/Vehicle");

// 🔹 Get All Vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Add Vehicle (Registration)
exports.addVehicle = async (req, res) => {
  try {
    const { vehicleNumber, purpose, date, checkInTime } = req.body;

    // Check if vehicleNumber already exists
    const existingVehicle = await Vehicle.findOne({ vehicleNumber });
    if (existingVehicle) {
      return res.status(400).json({ message: "Vehicle already exists" });
    }

    const newVehicle = new Vehicle({
      vehicleNumber,
      purpose,
      date,
      checkInTime,
      checkOutTime: "",
    });
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle registered successfully", vehicle: newVehicle });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 🔹 Checkout Vehicle
exports.checkoutVehicle = async (req, res) => {
  try {
    const { vehicleNumber, checkOutTime } = req.body;
    const vehicle = await Vehicle.findOne({ vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.checkOutTime !== "") {
      return res.status(400).json({ message: "Vehicle already checked out" });
    }

    vehicle.checkOutTime = checkOutTime;
    await vehicle.save();
    res.status(200).json({ message: "Vehicle checked out successfully", vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete Vehicle (Optional)
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};