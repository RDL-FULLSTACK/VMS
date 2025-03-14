//reportmodel.js
const mongoose = require("mongoose");
const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: String, required: true },
  purpose: { type: String, required: true },
  checkInTime: { type: Date, required: true }, // Renamed from visit_date for consistency
  checkOutTime: { type: Date, default: null }, // Added to track checkout time
  meetingDuration: { type: Number, default: null }, // Duration in minutes
  teamMembersCount: { type: Number, default: 1 }, // Added to match your frontend
});

module.exports = mongoose.model("Report", ReportSchema);