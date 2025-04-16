const express = require("express");
const router = express.Router();
const {
    getAllVisitors,
    getLatestVisitor,
    getVisitorById,
    addVisitor,
    sendEmailOtp,
    checkOutVisitor,
    deleteVisitor,
    updateVisitor,
    verifyOtp,
    getVisitors,
    storeCheckoutData,
    searchVisitorByLastFourDigits,
} = require("../controllers/visitorController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("Multer destination called for visitor photo");
        cb(null, "uploads/"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        console.log("Multer filename called, original file:", file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        console.log("Multer fileFilter called, mimetype:", file.mimetype);
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed!"), false);
        }
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit to 10MB
});

// Routes
router.get("/", getAllVisitors);
router.get("/report", getVisitors);
router.get("/latest", getLatestVisitor);
router.get("/search", searchVisitorByLastFourDigits);
router.get("/:id", getVisitorById);
router.post("/checkin", (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
        if (err) {
            console.error("Multer error on /checkin:", err.message);
            return res.status(400).json({ success: false, message: `File upload error: ${err.message}` });
        }
        if (req.file) {
            console.log("File uploaded successfully:", req.file);
        } else {
            console.log("No file uploaded for /checkin");
        }
        next();
    });
}, addVisitor);
router.put("/checkout/:id", checkOutVisitor);
router.post("/checkout/:id", storeCheckoutData);
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;