import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Input,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Settings = () => {
  const navigate = useNavigate();
  const [loginImages, setLoginImages] = useState(
    JSON.parse(localStorage.getItem("loginImages")) || []
  );
  const [newImage, setNewImage] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setNewImage(imageUrl);
    }
  };

  // Save new image to login images
  const handleImageSave = () => {
    if (newImage) {
      const updatedImages = [...loginImages, newImage];
      setLoginImages(updatedImages);
      localStorage.setItem("loginImages", JSON.stringify(updatedImages));
      setNewImage(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#ffffff",
      }}
    >
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          mt: 8,
          mb: 4,
          flex: 1,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {loginImages.length > 0 ? (
            <img
              src={loginImages[loginImages.length - 1]} // Show the latest uploaded image
              alt="Settings Visual"
              style={{
                width: "100%",
                maxWidth: "400px",
                borderRadius: "16px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              }}
            />
          ) : (
            <Typography>No images uploaded yet</Typography>
          )}
        </Box>

        <Box
          sx={{
            flex: 1,
            background: "rgba(245, 245, 245, 0.9)",
            borderRadius: "16px",
            padding: 4,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              textAlign: "center",
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 4,
            }}
          >
            Settings
          </Typography>

          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
              mb: 4,
            }}
          >
            <Button
              variant="contained"
              onClick={() => navigate("/reports")}
              sx={{
                py: 1,
                px: 3,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #42a5f5, #1976d2)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
                },
              }}
            >
              Reports
            </Button>

            <Button
              variant="contained"
              onClick={() => navigate("/gates")}
              sx={{
                py: 1,
                px: 3,
                background: "linear-gradient(45deg, #388e3c, #66bb6a)",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(56, 142, 60, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #66bb6a, #388e3c)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(56, 142, 60, 0.6)",
                },
              }}
            >
              Gates
            </Button>

            <Button
              variant="contained"
              onClick={handleLogout}
              sx={{
                py: 1,
                px: 3,
                background: "linear-gradient(45deg, #d32f2f, #f44336)",
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: "bold",
                textTransform: "none",
                boxShadow: "0 4px 15px rgba(211, 47, 47, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #f44336, #d32f2f)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(211, 47, 47, 0.6)",
                },
              }}
            >
              Logout
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel
                sx={{
                  color: "#333",
                  fontWeight: "bold",
                  mb: 1,
                }}
              >
                Change Login Image
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                sx={{ mb: 2 }}
              />
            </FormControl>
            {newImage && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <img
                  src={newImage}
                  alt="Preview"
                  style={{
                    maxWidth: "200px",
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleImageSave}
                  sx={{
                    background: "linear-gradient(45deg, #0288d1, #4fc3f7)",
                    borderRadius: "25px",
                    fontWeight: "bold",
                    textTransform: "none",
                    "&:hover": {
                      background: "linear-gradient(45deg, #4fc3f7, #0288d1)",
                    },
                  }}
                >
                  Save Image
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Settings;