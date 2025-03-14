//visitorRoutes.js




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
    verifyEmailOtp,
    getVisitors,
    storeCheckoutData, // Added this
} = require("../controllers/visitorController");
const multer = require("multer");
const path = require("path");

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to save uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        // Accept images only
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
router.get("/:id", getVisitorById);
router.post("/checkin", upload.single("photo"), addVisitor); // Multer for photo upload
router.put("/checkout/:id", checkOutVisitor); // Kept for legacy compatibility (if needed)
router.post("/checkout/:id", storeCheckoutData); // New route for simplified checkout
router.put("/:id", updateVisitor);
router.delete("/:id", deleteVisitor);
router.post("/send-email-otp", sendEmailOtp);
router.post("/verify-email-otp", verifyEmailOtp);

module.exports = router;