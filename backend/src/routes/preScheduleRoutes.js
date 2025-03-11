



const express = require("express");
const router = express.Router();
const PreSchedule = require("../models/PreSchedule");
const nodemailer = require("nodemailer");
require("dotenv").config();

// MongoDB Connection Check (ensure this is in your main app.js or before routes)
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

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
    const { name, date, purpose, host, email } = req.body;
  

    if (!name || !date || !purpose || !host || !email) {
      return res.status(400).json({ message: "All fields (name, date, purpose, host, email) are required" });
    }

    const preSchedule = new PreSchedule({
      name,
      date,
      purpose,
      host,
      email,
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

// PUT /api/preschedules/:id/approve - Approve and send email with OTP
router.put("/preschedules/:id/approve", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) {
      console.log(`Pre-schedule not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Pre-schedule not found" });
    }

    preSchedule.status = "Approved";
    // const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate OTP for email
    await preSchedule.save();

    const approvalMailOptions = {
      from: process.env.EMAIL_USER,
      to: preSchedule.email,
      subject: "Visit Request Approved",
      text: `Dear ${preSchedule.name},\n\nYour visit request for "${preSchedule.purpose}" on ${preSchedule.date} at ${preSchedule.Time} has been approved by ${preSchedule.host}.\n\nRegards,\nTeam`,
    };

  
    await sendEmail(approvalMailOptions);

    res.status(200).json({ message: "Pre-schedule approved, email sent.", preSchedule });
  } catch (error) {
    console.error("Error approving pre-schedule:", error);
    res.status(500).json({ message: "Error approving pre-schedule", error });
  }
});

// PUT /api/preschedules/:id/reject - Reject and send email with purpose
router.put("/preschedules/:id/reject", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) {
      console.log(`Pre-schedule not found for ID: ${req.params.id}`);
      return res.status(404).json({ message: "Pre-schedule not found" });
    }

    preSchedule.status = "Rejected";
    await preSchedule.save();
    console.log("Pre-schedule rejected and retained in DB:", preSchedule);

    const rejectionMailOptions = {
      from: process.env.EMAIL_USER,
      to: preSchedule.email,
      subject: "Visit Request Rejected",
      text: `Dear ${preSchedule.name},\n\nYour visit request for "${preSchedule.purpose}" on ${preSchedule.date} at ${preSchedule.Time} has been rejected by ${preSchedule.host}.\n\nRegards,\nTeam`,
    };

    console.log("Sending rejection email to:", preSchedule.email);
    await sendEmail(rejectionMailOptions);

    res.status(200).json({ message: "Pre-schedule rejected, email sent, and record retained in DB", preSchedule });
  } catch (error) {
    console.error("Error rejecting pre-schedule:", error);
    res.status(500).json({ message: "Error rejecting pre-schedule", error });
  }
});

module.exports = router;