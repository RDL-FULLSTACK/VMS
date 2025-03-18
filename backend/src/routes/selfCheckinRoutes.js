// selfCheckinRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path"); // Added path import
require("dotenv").config();

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// SelfCheckin Model
const SelfCheckin = require("../models/SelfCheckin");

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// POST /checkin - Create new self-checkin
router.post(
  "/checkin",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "teamMemberDocuments", maxCount: 10 },
  ]),
  async (req, res) => {
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
        !fullName || !email || !phoneNumber || !designation || !visitType ||
        !expectedDuration || !documentDetails || !reasonForVisit || !visitorCompany || 
        !personToVisit || !submittedDocument || !hasAssets || !hasTeamMembers || !department
      ) {
        return res.status(400).json({
          message: "All required fields must be provided"
        });
      }

      // Validate assets if hasAssets is "yes"
      if (hasAssets === "yes" && (!assets || !Array.isArray(JSON.parse(assets)) || JSON.parse(assets).length === 0)) {
        return res.status(400).json({
          message: "Assets are required when hasAssets is 'yes'"
        });
      }

      // Validate team members if hasTeamMembers is "yes"
      if (hasTeamMembers === "yes" && (!teamMembers || !Array.isArray(JSON.parse(teamMembers)) || JSON.parse(teamMembers).length === 0)) {
        return res.status(400).json({
          message: "Team members are required when hasTeamMembers is 'yes'"
        });
      }

      // Process file uploads
      const photoUrl = req.files["photo"] ? req.files["photo"][0].path : undefined;
      const teamMemberDocs = req.files["teamMemberDocuments"] 
        ? req.files["teamMemberDocuments"].map(file => file.path)
        : [];

      // Parse JSON strings if they come as strings
      const parsedAssets = typeof assets === "string" ? JSON.parse(assets) : assets;
      const parsedTeamMembers = typeof teamMembers === "string" ? JSON.parse(teamMembers) : teamMembers;
      const parsedDuration = typeof expectedDuration === "string" ? JSON.parse(expectedDuration) : expectedDuration;

      const selfCheckin = new SelfCheckin({
        fullName,
        email,
        phoneNumber,
        designation,
        visitType,
        expectedDuration: {
          hours: parsedDuration.hours,
          minutes: parsedDuration.minutes
        },
        documentDetails,
        photoUrl,
        reasonForVisit,
        visitorCompany,
        personToVisit,
        submittedDocument,
        hasAssets,
        assets: hasAssets === "yes" ? parsedAssets : [],
        hasTeamMembers,
        teamMembers: hasTeamMembers === "yes" ? parsedTeamMembers : [],
        department
      });

      const savedCheckin = await selfCheckin.save();
      res.status(201).json(savedCheckin);
    } catch (error) {
      console.error("Error saving self-checkin:", error);
      res.status(500).json({ message: "Error saving self-checkin", error: error.message });
    }
  }
);

// GET /status - Fetch all self-checkins
router.get("/status", async (req, res) => {
  try {
    const selfCheckins = await SelfCheckin.find({});
    res.status(200).json(selfCheckins);
  } catch (error) {
    console.error("Error fetching self-checkins:", error);
    res.status(500).json({ message: "Error fetching self-checkins", error });
  }
});

// GET /checkin/:id - Fetch single self-checkin
router.get("/checkin/:id", async (req, res) => {
  try {
    const selfCheckin = await SelfCheckin.findById(req.params.id);
    if (!selfCheckin) {
      return res.status(404).json({ message: "Self-checkin not found" });
    }
    res.status(200).json(selfCheckin);
  } catch (error) {
    console.error("Error fetching self-checkin:", error);
    res.status(500).json({ message: "Error fetching self-checkin", error });
  }
});

// PUT /checkin/:id - Update self-checkin
router.put("/checkin/:id", async (req, res) => {
  try {
    const selfCheckin = await SelfCheckin.findById(req.params.id);
    if (!selfCheckin) {
      return res.status(404).json({ message: "Self-checkin not found" });
    }

    const updates = req.body;
    if (updates.expectedDuration) {
      updates.expectedDuration = {
        hours: updates.expectedDuration.hours,
        minutes: updates.expectedDuration.minutes
      };
    }

    const updatedCheckin = await SelfCheckin.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );
    res.status(200).json(updatedCheckin);
  } catch (error) {
    console.error("Error updating self-checkin:", error);
    res.status(500).json({ message: "Error updating self-checkin", error });
  }
});

// DELETE /checkin/:id - Delete self-checkin
router.delete("/checkin/:id", async (req, res) => {
  try {
    const selfCheckin = await SelfCheckin.findById(req.params.id);
    if (!selfCheckin) {
      return res.status(404).json({ message: "Self-checkin not found" });
    }
    
    await SelfCheckin.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Self-checkin deleted successfully" });
  } catch (error) {
    console.error("Error deleting self-checkin:", error);
    res.status(500).json({ message: "Error deleting self-checkin", error: error.message });
  }
});

module.exports = router;