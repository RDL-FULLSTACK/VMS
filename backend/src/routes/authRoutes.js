// authRoutes.js

const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware =require("../middleware/authMiddleware")

const router = express.Router();



const {registerBulkUsers} = require("../controllers/authController");

// Existing routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/user", authMiddleware, authController.getUser);

// New routes for forgot password, verify OTP, and reset password
router.post("/forgot-password", authController.forgotPassword); // Line 10 (problematic)
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);
router.get("/users", authMiddleware, authController.getUsers);
router.post("/register-bulk", registerBulkUsers); // Add this

module.exports = router;