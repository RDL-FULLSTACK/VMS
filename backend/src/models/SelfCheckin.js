// src/models/SelfCheckin.js
const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  type: { type: String, required: true },
  serialNumber: { type: String, required: true },
});

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  documentDetail: { type: String, required: true },
  hasAssets: { type: String, enum: ["yes", "no"], required: true },
  assets: [AssetSchema],
});

const SelfCheckinSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  designation: { type: String, required: true },
  visitType: { type: String, required: true },
  expectedDuration: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
  },
  documentDetails: { type: String, required: true },
  photoUrl: { type: String }, // Optional now
  reasonForVisit: { type: String, required: true },
  otp: { type: String }, // Optional now
  visitorCompany: { type: String, required: true },
  personToVisit: { type: String, required: true },
  submittedDocument: { type: String, required: true },
  hasAssets: { type: String, enum: ["yes", "no"], required: true },
  assets: [AssetSchema],
  hasTeamMembers: { type: String, enum: ["yes", "no"], required: true },
  teamMembers: [TeamMemberSchema],
  department: { type: String, required: true },
  status: { type: String, default: "Self Checked In" },
  checkInTime: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("SelfCheckin", SelfCheckinSchema);