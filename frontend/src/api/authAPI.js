import axios from "axios";

const API_BASE_URL = "https://your-backend-url.com/api/auth";

//login
export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, { username, password });
    return response.data; 
  } catch (error) {
    console.error("Login Error:", error);
    throw error.response?.data || "Login failed";
  }
};

// Forgot Password API (Send OTP to email)
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
    return response.data; 
  } catch (error) {
    console.error("Forgot Password Error:", error);
    throw error.response?.data || "Failed to send OTP";
  }
};

// Verify OTP API
export const verifyOtp = async (email, otp) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, { email, otp });
    return response.data; 
  } catch (error) {
    console.error("OTP Verification Error:", error);
    throw error.response?.data || "Invalid OTP";
  }
};

// Reset Password API
export const resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/reset-password`, {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data; 
  } catch (error) {
    console.error("Reset Password Error:", error);
    throw error.response?.data || "Failed to reset password";
  }
};









