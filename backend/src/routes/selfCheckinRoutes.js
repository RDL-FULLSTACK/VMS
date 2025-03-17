// src/routes/selfCheckinRoutes.js
const express = require("express");
const router = express.Router();
const selfCheckinController = require("../controllers/selfCheckinController");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Self check-in route with file upload
router.post(
  "/checkin",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "teamMemberDocuments", maxCount: 10 },
  ]),
  selfCheckinController.selfCheckIn
);

// Check self-check-in status
router.get("/status", selfCheckinController.checkStatus);

module.exports = router;