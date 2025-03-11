const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true },
  purpose: { type: String, required: true },
  date: { type: String, required: true },
  checkInTime: { type: String, required: true },
  checkOutTime: { type: String, default: "" },
}, { timestamps: true });

const Vehicle = mongoose.model("Vehicle", VehicleSchema);
module.exports = Vehicle;