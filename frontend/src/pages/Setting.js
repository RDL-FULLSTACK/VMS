// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Container,
//   Input,
//   FormControl,
//   FormLabel,
//   Select,
//   MenuItem,
//   CircularProgress,
//   IconButton,
//   Alert,
// } from "@mui/material";
// import { Delete as DeleteIcon } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import axios from "axios";

// const Settings = () => {
//   const navigate = useNavigate();
//   const [loginImages, setLoginImages] = useState([]);
//   const [selectedGate, setSelectedGate] = useState(
//     localStorage.getItem("selectedGate") || ""
//   );
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);

//   // Default backend URL if environment variable is not set
//   const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

//   // Fetch login images from backend on mount
//   useEffect(() => {
//     const fetchImages = async () => {
//       try {
//         const response = await axios.get(`${BACKEND_URL}/api/login-images`);
//         setLoginImages(response.data);
//       } catch (error) {
//         console.error("Failed to fetch login images:", error);
//         setError("Failed to load images.");
//       }
//     };
//     fetchImages();
//   }, [BACKEND_URL]);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     toast.success("Logged out successfully!");
//     setTimeout(() => navigate("/"), 1500);
//   };

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       setError("Please upload a valid image file.");
//       return;
//     }

//     setIsUploading(true);
//     setError(null);
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const response = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       const fullImageUrl = `${BACKEND_URL}${response.data.imageUrl}`;
//       setLoginImages((prev) => [...prev, fullImageUrl]);
//       toast.success("Image uploaded successfully!");
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setError("Failed to upload image. Please try again.");
//       toast.error("Error uploading image.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleRemoveImage = async (imageUrl) => {
//     try {
//       await axios.delete(`${BACKEND_URL}/api/login-images/${encodeURIComponent(imageUrl)}`);
//       const updatedImages = loginImages.filter((img) => img !== imageUrl);
//       setLoginImages(updatedImages);
//       toast.info("Image removed.");
//     } catch (error) {
//       console.error("Error removing image:", error);
//       toast.error("Failed to remove image.");
//     }
//   };

//   const handleGateChange = async (event) => {
//     const gate = event.target.value;
//     setSelectedGate(gate);
//     localStorage.setItem("selectedGate", gate);
//     toast.success(`Gate set to ${gate}`);

//     try {
//       const response = await fetch("http://localhost:5000/api/settings/gate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({ selectedGate: gate }),
//       });

//       if (!response.ok) throw new Error("Failed to save gate selection");
//     } catch (error) {
//       console.error("Error saving gate selection:", error);
//       toast.error("Failed to save gate selection to server.");
//     }
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       <Navbar />
//       <Container maxWidth="md" sx={{ mt: 8, mb: 4, flex: 1 }}>
//         <ToastContainer position="top-right" autoClose={3000} />
//         <Typography variant="h4" gutterBottom align="center">
//           Settings
//         </Typography>

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <FormLabel>Select Gate</FormLabel>
//           <Select
//             value={selectedGate}
//             onChange={handleGateChange}
//             displayEmpty
//             renderValue={(value) => (value ? value : "Select a gate")}
//           >
//             <MenuItem value="" disabled>
//               Select a gate
//             </MenuItem>
//             <MenuItem value="Gate 1">Gate 1</MenuItem>
//             <MenuItem value="Gate 2">Gate 2</MenuItem>
//             <MenuItem value="Gate 3">Gate 3</MenuItem>
//           </Select>
//         </FormControl>

//         <FormControl fullWidth sx={{ mb: 3 }}>
//           <FormLabel>Change Login Image</FormLabel>
//           <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <Input
//               type="file"
//               accept="image/*"
//               onChange={handleImageChange}
//               disabled={isUploading}
//             />
//             {isUploading && <CircularProgress size={24} />}
//           </Box>
//           {error && (
//             <Alert severity="error" sx={{ mt: 2 }}>
//               {error}
//             </Alert>
//           )}
//         </FormControl>

//         {loginImages.length > 0 && (
//           <Box sx={{ mt: 3 }}>
//             <Typography variant="h6">Uploaded Images</Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexWrap: "wrap",
//                 gap: 2,
//                 mt: 2,
//               }}
//             >
//               {loginImages.map((imageUrl, index) => (
//                 <Box key={index} sx={{ position: "relative" }}>
//                   <img
//                     src={imageUrl}
//                     alt={`Uploaded ${index}`}
//                     style={{
//                       width: "100%",
//                       maxWidth: "150px",
//                       height: "auto",
//                       borderRadius: "10px",
//                       objectFit: "cover",
//                     }}
//                   />
//                   <IconButton
//                     sx={{
//                       position: "absolute",
//                       top: 0,
//                       right: 0,
//                       bgcolor: "rgba(255, 255, 255, 0.7)",
//                     }}
//                     onClick={() => handleRemoveImage(imageUrl)}
//                   >
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         )}

//         <Button
//           variant="contained"
//           color="secondary"
//           onClick={handleLogout}
//           sx={{ mt: 4, display: "block", mx: "auto" }}
//         >
//           Logout
//         </Button>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default Settings;








import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Container,
  Input,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

const Settings = () => {
  const navigate = useNavigate();
  const [loginImages, setLoginImages] = useState([]);
  const [selectedGate, setSelectedGate] = useState(
    localStorage.getItem("selectedGate") || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  // Default backend URL if environment variable is not set
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Fetch login images from backend on mount
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
    fetchImages();
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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 8, mb: 4, flex: 1 }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Typography variant="h4" gutterBottom align="center">
          Settings
        </Typography>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Select Gate</FormLabel>
          <Select
            value={selectedGate}
            onChange={handleGateChange}
            displayEmpty
            renderValue={(value) => (value ? value : "Select a gate")}
          >
            <MenuItem value="" disabled>
              Select a gate
            </MenuItem>
            <MenuItem value="Gate 1">Gate 1</MenuItem>
            <MenuItem value="Gate 2">Gate 2</MenuItem>
            <MenuItem value="Gate 3">Gate 3</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mb: 3 }}>
          <FormLabel>Change Login Image</FormLabel>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isUploading}
            />
            {isUploading && <CircularProgress size={24} />}
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </FormControl>

        {loginImages.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Uploaded Images</Typography>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              {loginImages.map((imageUrl, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={imageUrl}
                    alt={`Uploaded ${index}`}
                    style={{
                      width: "100%",
                      maxWidth: "150px",
                      height: "auto",
                      borderRadius: "10px",
                      objectFit: "cover",
                    }}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                    }}
                    onClick={() => handleRemoveImage(imageUrl)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
          >
            Logout
          </Button>
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
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default Settings;