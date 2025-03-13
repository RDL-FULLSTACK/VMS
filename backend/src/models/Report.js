const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  host: { type: String, required: true },
  purpose: { type: String, required: true },
  visit_date: { type: Date, required: true },
});

module.exports = mongoose.model("Report", ReportSchema);
