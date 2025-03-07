const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor"); // Assuming you have a Visitor model

// Route to get the latest checked-in visitor
router.get("/latest", async (req, res) => {
  try {
    const latestVisitor = await Visitor.findOne().sort({ createdAt: -1 });
    if (!latestVisitor) {
      return res.status(404).json({ message: "No visitors found" });
    }
    res.json(latestVisitor);
  } catch (error) {
    console.error("Error fetching latest visitor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to get all visitors
router.get("/", async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.json(visitors);
  } catch (error) {
    console.error("Error fetching visitors:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to add a new visitor (Check-in)
router.post("/checkin", async (req, res) => {
  try {
    const { fullName, id, time, personToVisit, reasonForVisit, visitorCompany, photo, phoneNumber, email, designation } = req.body;
    
    if (!fullName || !id || !time || !personToVisit) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newVisitor = new Visitor({
      fullName,
      id,
      time,
      personToVisit,
      reasonForVisit,
      visitorCompany,
      photo,
      phoneNumber,
      email,
      designation
    });

    await newVisitor.save();
    res.status(201).json({ message: "Visitor checked in successfully", visitor: newVisitor });
  } catch (error) {
    console.error("Error checking in visitor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route to delete a visitor (optional)
router.delete("/:id", async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) {
      return res.status(404).json({ message: "Visitor not found" });
    }
    res.json({ message: "Visitor deleted successfully" });
  } catch (error) {
    console.error("Error deleting visitor:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
