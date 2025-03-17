const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();

// MongoDB Connection
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Schemas and Model
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
  teamMembers: [TeamMemberSchema],
}, { timestamps: true });

const PreSchedule = mongoose.model("PreSchedule", preScheduleSchema);

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verify Nodemailer configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("Nodemailer configuration error:", error);
  } else {
    console.log("Nodemailer is ready to send emails");
  }
});

// Helper function to send email with Promise
const sendEmail = (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Email sending error:", error);
        reject(error);
      } else {
        console.log("Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
};

// POST /api/preschedule - Save pre-scheduling data
router.post("/preschedule", async (req, res) => {
  try {
    const {
      name,
      date,
      purpose,
      host,
      email,
      department,
      phoneNumber,
      designation,
      visitType,
      expectedDuration,
      hasAssets,
      assets,
      teamMembers, // Added teamMembers
    } = req.body;

    // Validate all required fields
    if (
      !name ||
      !date ||
      !purpose ||
      !host ||
      !email ||
      !department ||
      !phoneNumber ||
      !designation ||
      !visitType ||
      !expectedDuration ||
      !expectedDuration.hours ||
      !expectedDuration.minutes ||
      !hasAssets
    ) {
      return res.status(400).json({
        message:
          "All fields (name, date, purpose, host, email, department, phoneNumber, designation, visitType, expectedDuration (hours and minutes), hasAssets) are required",
      });
    }

    // Validate assets if hasAssets is "yes"
    if (hasAssets === "yes" && (!assets || !Array.isArray(assets) || assets.length === 0)) {
      return res.status(400).json({
        message: "Assets are required when hasAssets is 'yes'",
      });
    }

    // Validate team members if provided
    if (teamMembers && Array.isArray(teamMembers)) {
      for (const member of teamMembers) {
        if (!member.name || !member.email || !member.documentDetail || !member.hasAssets) {
          return res.status(400).json({
            message: "All team members must have name, email, documentDetail, and hasAssets",
          });
        }
        if (member.hasAssets === "yes" && (!member.assets || !Array.isArray(member.assets) || member.assets.length === 0)) {
          return res.status(400).json({
            message: "Assets are required for team member when their hasAssets is 'yes'",
          });
        }
      }
    }

    const preSchedule = new PreSchedule({
      name,
      date,
      purpose,
      host,
      email,
      department,
      phoneNumber,
      designation,
      visitType,
      expectedDuration: {
        hours: expectedDuration.hours,
        minutes: expectedDuration.minutes,
      },
      hasAssets,
      assets: hasAssets === "yes" ? assets : [],
      teamMembers: teamMembers || [], // Add team members (empty array if not provided)
      Time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });

    const savedSchedule = await preSchedule.save();

    res.status(201).json(savedSchedule);
  } catch (error) {
    console.error("Error saving pre-scheduling data:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
    });
    res.status(500).json({ message: "Error saving pre-scheduling data", error: error.message });
  }
});

// GET /api/preschedules - Fetch pre-scheduled visitors
router.get("/preschedules", async (req, res) => {
  try {
    const preSchedules = await PreSchedule.find({});
    res.status(200).json(preSchedules);
  } catch (error) {
    console.error("Error fetching pre-schedules:", error);
    res.status(500).json({ message: "Error fetching pre-schedules", error });
  }
});

// PUT /api/preschedules/:id/approve - Approve and send email
router.put("/preschedules/:id/approve", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) {
      console.log(`Pre-schedule not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Pre-schedule not found" });
    }

    preSchedule.status = "Approved";
    await preSchedule.save();

    // Include team members in the email if they exist
    const teamMembersText = preSchedule.teamMembers.length > 0 
      ? `\n\nTeam Members:\n${preSchedule.teamMembers.map(m => 
          `${m.name} (${m.email}) - Document: ${m.documentDetail}${m.hasAssets === 'yes' ? ', Has Assets' : ''}`
        ).join('\n')}`
      : '';

    const approvalMailOptions = {
      from: process.env.EMAIL_USER,
      to: preSchedule.email,
      subject: "Visit Request Approved",
      text: `Dear ${preSchedule.name},\n\nYour visit request for "${preSchedule.purpose}" on ${preSchedule.date} at ${preSchedule.Time} has been approved by ${preSchedule.host}.\n\nDepartment: ${preSchedule.department}\nVisit Type: ${preSchedule.visitType}\nDuration: ${preSchedule.expectedDuration.hours}h ${preSchedule.expectedDuration.minutes}m${teamMembersText}\n\nRegards,\nTeam`,
    };

    await sendEmail(approvalMailOptions);

    res.status(200).json({ message: "Pre-schedule approved, email sent.", preSchedule });
  } catch (error) {
    console.error("Error approving pre-schedule:", error);
    res.status(500).json({ message: "Error approving pre-schedule", error });
  }
});

// PUT /api/preschedules/:id/reject - Reject and send email
router.put("/preschedules/:id/reject", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) {
      console.log(`Pre-schedule not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Pre-schedule not found" });
    }

    preSchedule.status = "Rejected";
    await preSchedule.save();

    // Include team members in the email if they exist
    const teamMembersText = preSchedule.teamMembers.length > 0 
      ? `\n\nTeam Members:\n${preSchedule.teamMembers.map(m => 
          `${m.name} (${m.email}) - Document: ${m.documentDetail}${m.hasAssets === 'yes' ? ', Has Assets' : ''}`
        ).join('\n')}`
      : '';

    const rejectionMailOptions = {
      from: process.env.EMAIL_USER,
      to: preSchedule.email,
      subject: "Visit Request Rejected",
      text: `Dear ${preSchedule.name},\n\nYour visit request for "${preSchedule.purpose}" on ${preSchedule.date} at ${preSchedule.Time} has been rejected by ${preSchedule.host}.\n\nDepartment: ${preSchedule.department}\nVisit Type: ${preSchedule.visitType}\nDuration: ${preSchedule.expectedDuration.hours}h ${preSchedule.expectedDuration.minutes}m${teamMembersText}\n\nRegards,\nTeam`,
    };

    await sendEmail(rejectionMailOptions);

    res.status(200).json({ message: "Pre-schedule rejected, email sent, and record retained in DB", preSchedule });
  } catch (error) {
    console.error("Error rejecting pre-schedule:", error);
    res.status(500).json({ message: "Error rejecting pre-schedule", error });
  }
});

module.exports = router;