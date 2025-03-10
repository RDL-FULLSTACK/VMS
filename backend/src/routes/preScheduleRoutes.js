const express = require("express");
const router = express.Router();
const PreSchedule = require("../models/PreSchedule");
const Visitor = require("../models/Visitor");

// POST /api/preschedule - Save pre-scheduling data
router.post("/preschedule", async (req, res) => {
  try {
    const { name, date, purpose, host } = req.body;
    const preSchedule = new PreSchedule({
      name,
      date,
      purpose,
      host,
      Time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    });
    await preSchedule.save();
    res.status(201).json(preSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error saving pre-scheduling data", error });
  }
});

// GET /api/preschedules - Fetch pre-scheduled visitors by host
router.get("/preschedules", async (req, res) => {
  try {
    const { host } = req.query; // Filter by host
    const preSchedules = await PreSchedule.find(host ? { host } : {});
    res.status(200).json(preSchedules);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pre-schedules", error });
  }
});

// PUT /api/preschedules/:id/approve - Approve a pre-scheduled visitor
router.put("/preschedules/:id/approve", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) return res.status(404).json({ message: "Pre-schedule not found" });

    preSchedule.status = "Approved";
    await preSchedule.save();

    // Move to Visitor collection
    const visitor = new Visitor({
      name: preSchedule.name,
      date: preSchedule.date,
      purpose: preSchedule.purpose,
      Time: preSchedule.Time,
      host: preSchedule.host,
      otp: Math.floor(100000 + Math.random() * 900000).toString(),
    });
    await visitor.save();

    // Optionally delete from PreSchedule after approval
    await PreSchedule.findByIdAndDelete(req.params.id);

    res.status(200).json(visitor);
  } catch (error) {
    res.status(500).json({ message: "Error approving pre-schedule", error });
  }
});

// PUT /api/preschedules/:id/reject - Reject a pre-scheduled visitor
router.put("/preschedules/:id/reject", async (req, res) => {
  try {
    const preSchedule = await PreSchedule.findById(req.params.id);
    if (!preSchedule) return res.status(404).json({ message: "Pre-schedule not found" });

    preSchedule.status = "Rejected";
    await preSchedule.save();

    // Optionally delete rejected entry
    // await PreSchedule.findByIdAndDelete(req.params.id);

    res.status(200).json(preSchedule);
  } catch (error) {
    res.status(500).json({ message: "Error rejecting pre-schedule", error });
  }
});

module.exports = router;