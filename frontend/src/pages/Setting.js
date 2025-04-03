// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Typography,
//   Container,
//   Input,
//   FormControl,
//   FormLabel,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const Settings = () => {
//   const navigate = useNavigate();
//   const [loginImages, setLoginImages] = useState(
//     JSON.parse(localStorage.getItem("loginImages")) || []
//   );
//   const [newImage, setNewImage] = useState(null);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/");
//   };

//   // Handle image upload
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const imageUrl = URL.createObjectURL(file);
//       setNewImage(imageUrl);
//     }
//   };

//   // Save new image to login images
//   const handleImageSave = () => {
//     if (newImage) {
//       const updatedImages = [...loginImages, newImage];
//       setLoginImages(updatedImages);
//       localStorage.setItem("loginImages", JSON.stringify(updatedImages));
//       setNewImage(null);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         flexDirection: "column",
//         background: "#ffffff",
//       }}
//     >
//       <Navbar />
//       <Container
//         maxWidth="md"
//         sx={{
//           mt: 8,
//           mb: 4,
//           flex: 1,
//           display: "flex",
//           flexDirection: "row",
//           justifyContent: "center",
//           alignItems: "center",
//           gap: 4,
//         }}
//       >
//         <Box
//           sx={{
//             flex: 1,
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {loginImages.length > 0 ? (
//             <img
//               src={loginImages[loginImages.length - 1]} // Show the latest uploaded image
//               alt="Settings Visual"
//               style={{
//                 width: "100%",
//                 maxWidth: "400px",
//                 borderRadius: "16px",
//                 boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//               }}
//             />
//           ) : (
//             <Typography>No images uploaded yet</Typography>
//           )}
//         </Box>

//         <Box
//           sx={{
//             flex: 1,
//             background: "rgba(245, 245, 245, 0.9)",
//             borderRadius: "16px",
//             padding: 4,
//             boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
//           }}
//         >
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{
//               fontWeight: "bold",
//               color: "#333",
//               textAlign: "center",
//               background: "linear-gradient(45deg, #1976d2, #42a5f5)",
//               WebkitBackgroundClip: "text",
//               WebkitTextFillColor: "transparent",
//               mb: 4,
//             }}
//           >
//             Settings
//           </Typography>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "row",
//               gap: 2,
//               justifyContent: "center",
//               flexWrap: "wrap",
//               mb: 4,
//             }}
//           >
//             <Button
//               variant="contained"
//               onClick={() => navigate("/reports")}
//               sx={{
//                 py: 1,
//                 px: 3,
//                 background: "linear-gradient(45deg, #1976d2, #42a5f5)",
//                 borderRadius: "25px",
//                 fontSize: "1rem",
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 boxShadow: "0 4px 15px rgba(25, 118, 210, 0.4)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #42a5f5, #1976d2)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 6px 20px rgba(25, 118, 210, 0.6)",
//                 },
//               }}
//             >
//               Reports
//             </Button>

//             <Button
//               variant="contained"
//               onClick={() => navigate("/gates")}
//               sx={{
//                 py: 1,
//                 px: 3,
//                 background: "linear-gradient(45deg, #388e3c, #66bb6a)",
//                 borderRadius: "25px",
//                 fontSize: "1rem",
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 boxShadow: "0 4px 15px rgba(56, 142, 60, 0.4)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #66bb6a, #388e3c)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 6px 20px rgba(56, 142, 60, 0.6)",
//                 },
//               }}
//             >
//               Gates
//             </Button>

//             <Button
//               variant="contained"
//               onClick={handleLogout}
//               sx={{
//                 py: 1,
//                 px: 3,
//                 background: "linear-gradient(45deg, #d32f2f, #f44336)",
//                 borderRadius: "25px",
//                 fontSize: "1rem",
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 boxShadow: "0 4px 15px rgba(211, 47, 47, 0.4)",
//                 transition: "all 0.3s ease",
//                 "&:hover": {
//                   background: "linear-gradient(45deg, #f44336, #d32f2f)",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 6px 20px rgba(211, 47, 47, 0.6)",
//                 },
//               }}
//             >
//               Logout
//             </Button>
//           </Box>

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               alignItems: "center",
//               gap: 2,
//             }}
//           >
//             <FormControl>
//               <FormLabel
//                 sx={{
//                   color: "#333",
//                   fontWeight: "bold",
//                   mb: 1,
//                 }}
//               >
//                 Change Login Image
//               </FormLabel>
//               <Input
//                 type="file"
//                 accept="image/*"
//                 onChange={handleImageChange}
//                 sx={{ mb: 2 }}
//               />
//             </FormControl>
//             {newImage && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   flexDirection: "column",
//                   alignItems: "center",
//                   gap: 2,
//                 }}
//               >
//                 <img
//                   src={newImage}
//                   alt="Preview"
//                   style={{
//                     maxWidth: "200px",
//                     borderRadius: "8px",
//                     boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   onClick={handleImageSave}
//                   sx={{
//                     background: "linear-gradient(45deg, #0288d1, #4fc3f7)",
//                     borderRadius: "25px",
//                     fontWeight: "bold",
//                     textTransform: "none",
//                     "&:hover": {
//                       background: "linear-gradient(45deg, #4fc3f7, #0288d1)",
//                     },
//                   }}
//                 >
//                   Save Image
//                 </Button>
//               </Box>
//             )}
//           </Box>
//         </Box>
//       </Container>
//       <Footer />
//     </Box>
//   );
// };

// export default Settings;
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

// const Settings = () => {
//   const navigate = useNavigate();
//   const [loginImages, setLoginImages] = useState(
//     JSON.parse(localStorage.getItem("loginImages")) || []
//   );
//   const [selectedGate, setSelectedGate] = useState(
//     localStorage.getItem("selectedGate") || ""
//   );
//   const [isUploading, setIsUploading] = useState(false);
//   const [error, setError] = useState(null);

//   // Sync localStorage with state on mount
//   useEffect(() => {
//     const storedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
//     const storedGate = localStorage.getItem("selectedGate") || "";
//     setLoginImages(storedImages);
//     setSelectedGate(storedGate);
//   }, []);

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
//       const response = await fetch("http://localhost:5000/api/upload", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload image");
//       }

//       const data = await response.json();
//       if (data.imageUrl) {
//         const fullImageUrl = `http://localhost:5000${data.imageUrl}`;
//         const updatedImages = [...loginImages, fullImageUrl];
//         setLoginImages(updatedImages);
//         localStorage.setItem("loginImages", JSON.stringify(updatedImages));
//         toast.success("Image uploaded successfully!");
//       } else {
//         throw new Error("No image URL returned");
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       setError("Failed to upload image. Please try again.");
//       toast.error("Error uploading image.");
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const handleRemoveImage = (index) => {
//     const updatedImages = loginImages.filter((_, i) => i !== index);
//     setLoginImages(updatedImages);
//     localStorage.setItem("loginImages", JSON.stringify(updatedImages));
//     toast.info("Image removed.");
//   };

//   const handleGateChange = async (event) => {
//     const gate = event.target.value;
//     setSelectedGate(gate);
//     localStorage.setItem("selectedGate", gate);
//     toast.success(`Gate set to ${gate}`);

//     // Optional: Persist gate selection to backend
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

//         {/* Gate Selection */}
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

//         {/* Image Upload */}
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

//         {/* Display Uploaded Images */}
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
//                     onClick={() => handleRemoveImage(index)}
//                   >
//                     <DeleteIcon color="error" />
//                   </IconButton>
//                 </Box>
//               ))}
//             </Box>
//           </Box>
//         )}

//         {/* Logout Button */}
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
// src/pages/Setting.js
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

const Settings = () => {
  const navigate = useNavigate();
  const [loginImages, setLoginImages] = useState(
    JSON.parse(localStorage.getItem("loginImages")) || []
  );
  const [selectedGate, setSelectedGate] = useState(
    localStorage.getItem("selectedGate") || ""
  );
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
    const storedGate = localStorage.getItem("selectedGate") || "";
    setLoginImages(storedImages);
    setSelectedGate(storedGate);
  }, []);

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
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      if (data.imageUrl) {
        const fullImageUrl = `http://localhost:5000${data.imageUrl}`;
        const updatedImages = [...loginImages, fullImageUrl];
        setLoginImages(updatedImages);
        localStorage.setItem("loginImages", JSON.stringify(updatedImages));
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error("No image URL returned");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("Failed to upload image. Please try again.");
      toast.error("Error uploading image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = loginImages.filter((_, i) => i !== index);
    setLoginImages(updatedImages);
    localStorage.setItem("loginImages", JSON.stringify(updatedImages));
    toast.info("Image removed.");
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
                    onClick={() => handleRemoveImage(index)}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={handleLogout}
          sx={{ mt: 4, display: "block", mx: "auto" }}
        >
          Logout
        </Button>
      </Container>
      <Footer />
    </Box>
  );
};

export default Settings;