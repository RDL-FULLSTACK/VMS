import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const LoginKiosk = () => {
  const navigate = useNavigate();
  const [visitorId, setVisitorId] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Use the REACT_APP_BACKEND_URL from the .env file
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Validate if the input is exactly 4 hexadecimal characters
  const isValidLastFourDigits = (id) => {
    const lastFourPattern = /^[0-9a-fA-F]{4}$/;
    return lastFourPattern.test(id);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!visitorId) {
      toast.error("Please enter the last 4 digits of your Visitor ID");
      return;
    }

    // Client-side validation for the last 4 digits
    if (!isValidLastFourDigits(visitorId)) {
      toast.error("Invalid input. Please enter exactly 4 hexadecimal characters (0-9, a-f).");
      return;
    }

    setLoginLoading(true);
    try {
      // Convert visitorId to lowercase to match backend normalization
      const normalizedVisitorId = visitorId.toLowerCase();

      // Make API call to search for the visitor by the last 4 digits
      const response = await axios.get(`${BACKEND_URL}/api/visitors/search`, {
        params: { lastFourDigits: normalizedVisitorId },
      });

      // Check if the response indicates success and contains visitor data
      if (response.status === 200 && response.data.success && response.data.data) {
        const visitorData = response.data.data;
        if (!visitorData._id) {
          throw new Error("Visitor ID not found in response");
        }
        toast.success("Visitor ID Verified Successfully!");
        setTimeout(() => {
          // Redirect to VideoPage.js with the full visitor ID as state
          navigate("/Videopage", { state: { userId: visitorData._id } });
        }, 1000);
      } else {
        throw new Error(response.data.message || "Invalid Visitor ID");
      }
    } catch (error) {
      console.error("Error verifying visitor ID:", error);
      // Handle specific backend errors
      if (error.response?.status === 500) {
        toast.error("Server error: Unable to verify Visitor ID. Please try again later.");
      } else if (error.response?.status === 404) {
        toast.error("Visitor ID not found. Please check the last 4 digits and try again.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid input. Please enter exactly 4 hexadecimal characters.");
      } else {
        toast.error(error.response?.data?.message || "An error occurred while verifying the Visitor ID.");
      }
      setLoginLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
        {/* Placeholder for an image or text */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" color="textSecondary">
            Kiosk Visitor Management
          </Typography>
        </Box>

        {/* Login Form */}
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
          <form onSubmit={handleLoginSubmit}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", mb: 2, color: "#4b0082" }}
            >
              Kiosk Login
            </Typography>
            <TextField
              fullWidth
              label="Enter Last 4 Digits of Visitor ID"
              variant="outlined"
              margin="dense"
              value={visitorId}
              onChange={(e) => setVisitorId(e.target.value)}
              disabled={loginLoading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#4b0082",
                  },
                  "&:hover fieldset": {
                    borderColor: "#6a0dad",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#4b0082",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#4b0082",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#4b0082",
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#4b0082",
                color: "white",
                mt: 2,
                ":hover": { backgroundColor: "#6a0dad" },
                position: "relative",
              }}
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? (
                <>
                  <CircularProgress
                    size={24}
                    sx={{
                      color: "white",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      marginTop: "-12px",
                      marginLeft: "-12px",
                    }}
                  />
                  Processing...
                </>
              ) : (
                "SUBMIT"
              )}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginKiosk;