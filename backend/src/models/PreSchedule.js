// const mongoose = require("mongoose");

// const preScheduleSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   date: { type: String, required: true },
//   purpose: { type: String, required: true },
//   Time: { type: String, required: true },
//   status: { type: String, default: "Pending" },
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("PreSchedule", preScheduleSchema);



const mongoose = require("mongoose");

const preScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
  Time: { type: String, required: true },
  host: { type: String, required: true }, // Host name or ID
  status: { type: String, default: "Pending" }, // Pending, Approved, Rejected
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PreSchedule", preScheduleSchema);