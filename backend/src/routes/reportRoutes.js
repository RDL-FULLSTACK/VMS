const express = require("express");
const router = express.Router();
const Report = require("../models/Report"); // Assuming you have a Report model
const{
  getReports,
  Addreport,
} = require("../controllers/reportsController")

// Get all visitor reports
// router.get("/reports", async (req, res) => {
//   try {
//     const reports = await Report.find(); // Fetch all reports from the database
//     res.status(200).json(reports);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching reports", error: error.message });
//   }
// });
router.get("/",getReports)
router.post("/add",Addreport)

module.exports = router;
