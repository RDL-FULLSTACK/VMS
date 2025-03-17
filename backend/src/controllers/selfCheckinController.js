// src/controllers/selfCheckinController.js
const SelfCheckin = require("../models/SelfCheckin");
const Visitor = require("../models/Visitor");

const selfCheckIn = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      designation,
      visitType,
      expectedDuration,
      documentDetails,
      reasonForVisit,
      visitorCompany,
      personToVisit,
      submittedDocument,
      hasAssets,
      assets,
      hasTeamMembers,
      teamMembers,
      department,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !designation ||
      !visitType ||
      !expectedDuration ||
      !documentDetails ||
      !reasonForVisit ||
      !visitorCompany ||
      !personToVisit ||
      !submittedDocument ||
      !hasAssets ||
      !hasTeamMembers ||
      !department
    ) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Parse JSON strings
    const parsedExpectedDuration = JSON.parse(expectedDuration);
    const parsedAssets = hasAssets === "yes" ? JSON.parse(assets) : [];
    const parsedTeamMembers = hasTeamMembers === "yes" ? JSON.parse(teamMembers) : [];

    // Check if self-check-in already exists
    const existingSelfCheckin = await SelfCheckin.findOne({ email });
    if (existingSelfCheckin) {
      return res.status(400).json({ message: "Self check-in already exists for this email" });
    }

    // Create new self-check-in
    const selfCheckin = new SelfCheckin({
      fullName,
      email,
      phoneNumber,
      designation,
      visitType,
      expectedDuration: {
        hours: parsedExpectedDuration.hours,
        minutes: parsedExpectedDuration.minutes,
      },
      documentDetails,
      reasonForVisit,
      visitorCompany,
      personToVisit,
      submittedDocument,
      hasAssets,
      assets: parsedAssets,
      hasTeamMembers,
      teamMembers: parsedTeamMembers,
      department,
      status: "Self Checked In",
      checkInTime: new Date(),
    });

    await selfCheckin.save();

    res.status(201).json(selfCheckin);
  } catch (error) {
    console.error("Self check-in error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const checkStatus = async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const selfCheckin = await SelfCheckin.findOne({ email });
    if (!selfCheckin) {
      return res.status(404).json({ message: "No self check-in found for this email" });
    }

    // Optionally fetch related visitor data
    const visitorData = await Visitor.findOne({ email });

    res.status(200).json({
      ...selfCheckin.toObject(),
      visitorData: visitorData ? visitorData.toObject() : null,
    });
  } catch (error) {
    console.error("Check status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  selfCheckIn,
  checkStatus,
};