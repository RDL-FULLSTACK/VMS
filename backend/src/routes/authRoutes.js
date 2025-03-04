// authRoutes.js

const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

// Existing routes
router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

// New routes for forgot password, verify OTP, and reset password
router.post("/forgot-password", authController.forgotPassword); // Line 10 (problematic)
router.post("/verify-otp", authController.verifyOtp);
router.post("/reset-password", authController.resetPassword);

module.exports = router;