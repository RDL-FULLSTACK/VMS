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

const VisitorSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  designation: { type: String, required: true },
  visitType: { type: String, required: true },
  expectedDuration: {
    hours: { type: Number, required: true },
    minutes: { type: Number, required: true },
  },
  documentDetails: { type: String, required: true },
  photoUrl: { type: String },
  reasonForVisit: { type: String, required: true },
  otp: { type: String, required: true },
  visitorCompany: { type: String, required: true },
  personToVisit: { type: String, required: true },
  submittedDocument: { type: String, required: true },
  hasAssets: { type: String, enum: ["yes", "no"], required: true },
  assets: [AssetSchema],
  teamMembers: [TeamMemberSchema],
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date },
  department: { type: String, required: true }, // Added department field
}, { timestamps: true });

module.exports = mongoose.model("Visitor", VisitorSchema);