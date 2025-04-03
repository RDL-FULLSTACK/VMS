const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();

// Ensure "loginimage" folder exists
const uploadDir = path.join(__dirname, "../../loginimage");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save files in loginimage folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Upload API
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  // Construct a proper image URL
  const imageUrl = `/loginimage/${req.file.filename}`;

  res.json({ imageUrl });
});

// Serve images statically
router.use("/loginimage", express.static(uploadDir));

module.exports = router;
