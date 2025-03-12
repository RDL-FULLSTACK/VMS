


const mongoose = require("mongoose");

const preScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
  host: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true }, // Added department field
  Time: { type: String, required: true }, // Ensure Time is defined
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("PreSchedule", preScheduleSchema);