import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert,
  TextField,
  Grid,
  Paper,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, CloudUpload as UploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const [loginImages, setLoginImages] = useState([]);
  const [navbarLogos, setNavbarLogos] = useState([]);
  const [notificationText, setNotificationText] = useState("");
  const [selectedGate, setSelectedGate] = useState(
    localStorage.getItem("selectedGate") || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/login-images`);
        setLoginImages(response.data);
      } catch (error) {
        console.error("Failed to fetch login images:", error);
        setError("Failed to load images.");
      }
    };
    const fetchNavbarLogos = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/logos`);
        setNavbarLogos(response.data);
      } catch (error) {
        console.error("Failed to fetch navbar logos:", error);
        setError("Failed to load navbar logos.");
      }
    };
    fetchImages();
    fetchNavbarLogos();

    const storedNotification = localStorage.getItem("customNotification") || "";
    setNotificationText(storedNotification);
  }, [BACKEND_URL]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fullImageUrl = `${BACKEND_URL}${response.data.imageUrl}`;
      setLoginImages((prev) => [...prev, fullImageUrl]);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleNavbarLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }

    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("logo", file);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/upload-logo`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const fullLogoUrl = `${BACKEND_URL}${response.data.logoUrl}`;
      setNavbarLogos((prev) => [...prev, fullLogoUrl]);
      toast.success("Navbar logo uploaded successfully!");
    } catch (error) {
      console.error("Error uploading navbar logo:", error);
      setError("Failed to upload navbar logo. Please try again.");
      toast.error("Error uploading navbar logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/login-images/${encodeURIComponent(imageUrl)}`);
      const updatedImages = loginImages.filter((img) => img !== imageUrl);
      setLoginImages(updatedImages);
      toast.info("Image removed.");
    } catch (error) {
      console.error("Error removing image:", error);
      toast.error("Failed to remove image.");
    }
  };

  const handleRemoveNavbarLogo = async (logoUrl) => {
    try {
      await axios.delete(`${BACKEND_URL}/api/logos/${encodeURIComponent(logoUrl)}`);
      const updatedLogos = navbarLogos.filter((logo) => logo !== logoUrl);
      setNavbarLogos(updatedLogos);
      toast.info("Navbar logo removed.");
    } catch (error) {
      console.error("Error removing navbar logo:", error);
      toast.error("Failed to remove navbar logo.");
    }
  };

  const handleNotificationChange = (e) => {
    const newText = e.target.value;
    setNotificationText(newText);
    localStorage.setItem("customNotification", newText);
  };

  const handleGateChange = async (event) => {
    const gate = event.target.value;
    setSelectedGate(gate);
    localStorage.setItem("selectedGate", gate);
    toast.success(`Gate set to ${gate}`);

    try {
      const response = await fetch("http://localhost:5000/api/settings/gate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ selectedGate: gate }),
      });

      if (!response.ok) throw new Error("Failed to save gate selection");
    } catch (error) {
      console.error("Error saving gate selection:", error);
      toast.error("Failed to save gate selection to server.");
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "#f8f9fa" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#2e1a47",
              background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Settings
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                py: 1,
                px: 4,
                background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
                borderRadius: "25px",
                textTransform: "none",
                fontWeight: "bold",
                boxShadow: "0 4px 15px rgba(46, 26, 71, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #3f2a5d, #7e5daf)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(46, 26, 71, 0.6)",
                },
              }}
            >
              Logout
            </Button>
            <Button
              variant="contained"
              onClick={() => navigate("/reports")}
              sx={{
                py: 1,
                px: 4,
                background: "linear-gradient(45deg, #26a69a, #4db6ac)",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(38, 166, 154, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #2bbbad, #56c7b8)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(38, 166, 154, 0.6)",
                },
              }}
            >
              Reports
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          {/* Left Half: Select Gate, Change Login Image, Uploaded Images */}
          <Grid item xs={12} md={6}>
            {/* Select Gate Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                Select Gate
              </Typography>
              <FormControl fullWidth>
                <Select
                  value={selectedGate}
                  onChange={handleGateChange}
                  displayEmpty
                  renderValue={(value) => (value ? value : "Select a gate")}
                  variant="filled"
                  sx={{
                    borderRadius: 2,
                    bgcolor: "#f1f3f5",
                    "&:before": { borderBottom: "none" },
                    "&:after": { borderBottom: "none" },
                    "&:hover": { bgcolor: "#e9ecef" },
                    "& .MuiFilledInput-input": { py: 1.5 },
                  }}
                >
                  <MenuItem value="" disabled>
                    Select a gate
                  </MenuItem>
                  <MenuItem value="Gate 1">Gate 1</MenuItem>
                  <MenuItem value="Gate 2">Gate 2</MenuItem>
                  <MenuItem value="Gate 3">Gate 3</MenuItem>
                </Select>
              </FormControl>
            </Paper>

            {/* Change Login Image Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                Change Login Image
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  component="label"
                  sx={{
                    background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    "&:hover": {
                      background: "linear-gradient(45deg, #3f2a5d, #7e5daf)",
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  Browse
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </Button>
                {isUploading && <CircularProgress size={24} />}
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>

            {/* Uploaded Images Section */}
            {loginImages.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                  Uploaded Images
                </Typography>
                <Box sx={{ display: "flex", overflowX: "auto", gap: 2, py: 1 }}>
                  {loginImages.map((imageUrl, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <img
                        src={imageUrl}
                        alt={`Uploaded ${index}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "2px solid #e9ecef",
                        }}
                      />
                      <Tooltip title="Remove Image">
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            "&:hover": { bgcolor: "#ffebee" },
                          }}
                          onClick={() => handleRemoveImage(imageUrl)}
                        >
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}
          </Grid>

          {/* Right Half: Change Navbar Logo, Uploaded Navbar Logos, Set Floating Notification */}
          <Grid item xs={12} md={6}>
            {/* Change Navbar Logo Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                Change Navbar Logo
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<UploadIcon />}
                  component="label"
                  sx={{
                    background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    py: 1,
                    "&:hover": {
                      background: "linear-gradient(45deg, #3f2a5d, #7e5daf)",
                      transform: "scale(1.02)",
                      transition: "all 0.3s ease",
                    },
                  }}
                >
                  Browse
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleNavbarLogoChange}
                    disabled={isUploading}
                  />
                </Button>
                {isUploading && <CircularProgress size={24} />}
              </Box>
              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}
            </Paper>

            {/* Uploaded Navbar Logos Section */}
            {navbarLogos.length > 0 && (
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  mb: 4,
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                  Uploaded Navbar Logos
                </Typography>
                <Box sx={{ display: "flex", overflowX: "auto", gap: 2, py: 1 }}>
                  {navbarLogos.map((logoUrl, index) => (
                    <Box
                      key={index}
                      sx={{
                        position: "relative",
                        flexShrink: 0,
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    >
                      <img
                        src={logoUrl}
                        alt={`Navbar Logo ${index}`}
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "2px solid #e9ecef",
                        }}
                      />
                      <Tooltip title="Remove Logo">
                        <IconButton
                          sx={{
                            position: "absolute",
                            top: -10,
                            right: -10,
                            bgcolor: "white",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            "&:hover": { bgcolor: "#ffebee" },
                          }}
                          onClick={() => handleRemoveNavbarLogo(logoUrl)}
                        >
                          <DeleteIcon color="error" fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              </Paper>
            )}

            {/* Set Floating Notification Section */}
            <Paper
              elevation={3}
              sx={{
                p: 3,
                mb: 4,
                borderRadius: 3,
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#2e1a47" }}>
                Set Floating Notification
              </Typography>
              <TextField
                value={notificationText}
                onChange={handleNotificationChange}
                placeholder="Enter custom notification"
                multiline
                rows={3}
                variant="filled"
                fullWidth
                sx={{
                  "& .MuiFilledInput-root": {
                    borderRadius: 2,
                    bgcolor: "#f1f3f5",
                    "&:before": { borderBottom: "none" },
                    "&:after": { borderBottom: "none" },
                    "&:hover": { bgcolor: "#e9ecef" },
                  },
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Settings;