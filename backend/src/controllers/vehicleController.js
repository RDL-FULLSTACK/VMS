//vehicleController.js

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

// 🔹 Add Vehicle
exports.addVehicle = async (req, res) => {
    try {
        const { vehicleNumber, vehicleType, owner } = req.body;

        // Check if vehicleNumber already exists
        const existingVehicle = await Vehicle.findOne({ vehicleNumber });
        if (existingVehicle) {
            return res.status(400).json({ message: "Vehicle already exists" });
        }

        const newVehicle = new Vehicle({ vehicleNumber, vehicleType, owner });
        await newVehicle.save();
        res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// 🔹 Delete Vehicle
exports.deleteVehicle = async (req, res) => {
    try {
        await Vehicle.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Vehicle deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
