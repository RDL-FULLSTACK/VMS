//vehicle.js

const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  vehicleType: { type: String, required: true },
  owner: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', VehicleSchema);
