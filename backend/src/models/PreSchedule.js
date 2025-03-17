// const mongoose = require("mongoose");

// const AssetSchema = new mongoose.Schema({
//   quantity: { type: Number, required: true },
//   type: { type: String, required: true },
//   serialNumber: { type: String, required: true },
// });

// const preScheduleSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   date: { type: String, required: true },
//   purpose: { type: String, required: true },
//   host: { type: String, required: true },
//   email: { type: String, required: true },
//   department: { type: String, required: true },
//   Time: { type: String, required: true },
//   status: { type: String, default: "Pending" },
//   // New fields added from VisitorSchema and AssetSchema
//   phoneNumber: { type: String, required: true },
//   designation: { type: String, required: true },
//   visitType: { type: String, required: true },
//   expectedDuration: {
//     hours: { type: Number, required: true },
//     minutes: { type: Number, required: true },
//   },
//   hasAssets: { type: String, enum: ["yes", "no"], required: true },
//   assets: [AssetSchema],
// }, { timestamps: true }); // Added timestamps for createdAt/updatedAt

// module.exports = mongoose.model("PreSchedule", preScheduleSchema);












const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  quantity: { type: Number, required: true },
  type: { type: String, required: true },
  serialNumber: { type: String, required: true },
});

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  documentDetail: { type: String, required: true },
  documentUrl: { type: String },
  hasAssets: { type: String, enum: ["yes", "no"], required: true },
  assets: [AssetSchema],
});

const preScheduleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  purpose: { type: String, required: true },
  host: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  Time: { type: String, required: true },
  status: { type: String, default: "Pending" },
  phoneNumber: { type: String, required: true },
  designation: { type: String, required: true },
  visitType: { type: String, required: true },
  expectedDuration: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
  },
  hasAssets: { type: String, enum: ["yes", "no"], required: true },
  assets: [AssetSchema],
  teamMembers: [TeamMemberSchema], // Added team members array
}, { timestamps: true });

module.exports = mongoose.model("PreSchedule", preScheduleSchema);