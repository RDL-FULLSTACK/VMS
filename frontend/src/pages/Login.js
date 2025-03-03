import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login, forgotPassword, verifyOtp, resetPassword } from "../api/authAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForgotPassword = () => {
  const navigate = useNavigate();
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  // Handle login
  const handleLoginSubmit = async () => {
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }
  
    setLoginLoading(true);
    try {
      await login(username, password);
      toast.success("Login Successful!");
  
      setTimeout(() => {
        navigate("/");
      }, 1000); 
  
    } catch (error) {
      toast.error("Login Failed");
    }
    setLoginLoading(false);
  };
  

  // Handle forgot password
  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      toast.error("Enter your email");
      return;
    }

    setOtpLoading(true);
    try {
      await forgotPassword(email);
      toast.success("OTP sent to your email.");
    } catch (error) {
      toast.error("Failed to send OTP");
    }
    setOtpLoading(false);
  };

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    if (!otp) {
      toast.error("Enter OTP");
      return;
    }

    setVerifyOtpLoading(true);
    try {
      await verifyOtp(email, otp);
      setOtpValid(true);
      toast.success("OTP verified! Enter a new password.");
    } catch (error) {
      toast.error("OTP verification failed");
    }
    setVerifyOtpLoading(false);
  };

  // Handle reset password
  const handleNewPasswordSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Enter new password and confirm it");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoginLoading(true);
    try {
      await resetPassword(email, newPassword, confirmPassword);
      toast.success("Password reset successful! You can now log in.");
      setIsForgotPassword(false);
      setOtpValid(false);
    } catch (error) {
      toast.error("Password reset failed");
    }
    setLoginLoading(false);
  };

  return (
   
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Sticky Header */}
   
      <Box
        sx={{
          backgroundColor: "#5a3d91",
          color: "white",
          fontSize: "18px",
          fontWeight: "bold",
          p: 2,
          textAlign: "left",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        
        Visitor Management System
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          p: 3,
          gap: 3,
        }}
      >
        {/* Image Section */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/assets/login-image.jpg" alt="Visitor Management" style={{ width: "100%", maxWidth: "400px" }} />
        </Box>

        {/* Form Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 2,
            textAlign: "center",
            width: "350px",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {!isForgotPassword ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Login
              </Typography>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="dense"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                label="Password"
                variant="outlined"
                margin="dense"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: "#4caf50", color: "white", mt: 2, ":hover": { backgroundColor: "#388e3c" } }}
                onClick={handleLoginSubmit}
                disabled={loginLoading}
              >
                {loginLoading ? "Processing..." : "SUBMIT"}
              </Button>

              <Typography
                variant="body2"
                sx={{
                  cursor: "pointer",
                  mt: 2,
                  textAlign: "center",
                  color: "#5a3d91",
                  fontWeight: "bold",
                  ":hover": { textDecoration: "underline" },
                }}
                onClick={() => setIsForgotPassword(true)}
              >
                Forgot Password?
              </Typography>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                Forgot Password
              </Typography>
              <TextField
                fullWidth
                label="Company Email"
                variant="outlined"
                margin="dense"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: "#4caf50", color: "white", mt: 2, ":hover": { backgroundColor: "#388e3c" } }}
                onClick={handleForgotPasswordSubmit}
                disabled={otpLoading}
              >
                {otpLoading ? "Sending OTP..." : "Send OTP"}
              </Button>

              {/* OTP Section */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <TextField
                  label="Enter OTP"
                  variant="outlined"
                  margin="dense"
                  sx={{ flex: 1 }}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "#4caf50", color: "white", height: "40px", ":hover": { backgroundColor: "#388e3c" } }}
                  onClick={handleOtpSubmit}
                  disabled={verifyOtpLoading}
                >
                  {verifyOtpLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Box>

              {otpValid && (
                <>
                  <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    margin="dense"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    margin="dense"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                fullWidth
                variant="contained"
                sx={{ backgroundColor: "#4caf50", color: "white", mt: 2, ":hover": { backgroundColor: "#388e3c" } }}
                onClick={handleNewPasswordSubmit}
                disabled={loginLoading}
              >
                {loginLoading ? "Processing..." : "SUBMIT"}
              </Button>
                </>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginForgotPassword;
