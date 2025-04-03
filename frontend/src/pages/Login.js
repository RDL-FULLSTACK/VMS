import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const LoginForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [loginImages, setLoginImages] = useState([]);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/login-images`);
        console.log("Fetched images from API:", response.data); // Debug log
        const images = response.data;
        if (images && images.length > 0) {
          setLoginImages(images);
        } else {
          setLoginImages([]);
          console.log("No images returned from API");
        }
      } catch (error) {
        console.error("Failed to fetch login images:", error);
        setLoginImages([]);
      }
    };
    fetchImages();
  }, [BACKEND_URL]);

  useEffect(() => {
    if (loginImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % loginImages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [loginImages.length]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await login(username, password);
      toast.success("Login Successful!");
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
      setTimeout(() => {
        switch (response.user.role) {
          case "admin":
            navigate("/dashboard");
            break;
          case "receptionist":
            navigate("/checkin");
            break;
          case "security":
            navigate("/vehicles");
            break;
          case "host":
            navigate("/HostDashboard");
            break;
          default:
            navigate("/");
        }
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Login Failed");
    }
    setLoginLoading(false);
  };

  const currentImageUrl = loginImages[currentImage] || "No image available";
  console.log("Current image URL:", currentImageUrl); // Debug log

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
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {loginImages.length > 0 && loginImages[currentImage] ? (
            <img
              src={loginImages[currentImage]}
              alt="Visitor Management"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                transition: "opacity 0.5s ease-in-out",
              }}
              onError={(e) => {
                console.error(`Failed to load image: ${loginImages[currentImage]}`);
                setLoginImages((prev) => prev.filter((_, i) => i !== currentImage));
              }}
              onLoad={() => console.log(`Image loaded: ${loginImages[currentImage]}`)}
            />
          ) : (
            <Typography variant="body1" color="textSecondary">
              No login images available.
            </Typography>
          )}
        </Box>

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
              sx={{
                backgroundColor: "#4caf50",
                color: "white",
                mt: 2,
                ":hover": { backgroundColor: "#388e3c" },
              }}
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading ? "Processing..." : "SUBMIT"}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
};

export default LoginForgotPassword;