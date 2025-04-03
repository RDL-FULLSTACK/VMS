// import React, { useState, useEffect } from "react";
// import { TextField, Button, Paper, Typography, Box } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { login } from "../api/authAPI";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const LoginForgotPassword = () => {
//   const navigate = useNavigate();
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginLoading, setLoginLoading] = useState(false);
//   const [currentImage, setCurrentImage] = useState(0);

//   // Load images from localStorage
//   const [loginImages, setLoginImages] = useState(() => {
//     const storedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
//     return storedImages.length > 0
//       ? storedImages
//       : ["https://via.placeholder.com/400x300?text=No+Image+Uploaded"]; // Default placeholder
//   });

//   // Effect for changing images
//   useEffect(() => {
//     if (loginImages.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentImage((prev) => (prev + 1) % loginImages.length);
//       }, 3000); // Change image every 3 seconds
//       return () => clearInterval(interval);
//     }
//   }, [loginImages.length]);

//   // Listen for changes in localStorage (optional, for real-time updates)
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const updatedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
//       setLoginImages(
//         updatedImages.length > 0
//           ? updatedImages
//           : ["https://via.placeholder.com/400x300?text=No+Image+Uploaded"]
//       );
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     if (!username || !password) {
//       toast.error("Enter username and password");
//       return;
//     }

//     setLoginLoading(true);
//     try {
//       const response = await login(username, password);
//       toast.success("Login Successful!");

//       localStorage.setItem("token", response.token);
//       localStorage.setItem("user", JSON.stringify(response.user));

//       setTimeout(() => {
//         switch (response.user.role) {
//           case "admin":
//             navigate("/dashboard");
//             break;
//           case "receptionist":
//             navigate("/checkin");
//             break;
//           case "security":
//             navigate("/vehicles");
//             break;
//           case "host":
//             navigate("/HostDashboard");
//             break;
//           default:
//             navigate("/");
//         }
//       }, 1000);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login Failed");
//     }
//     setLoginLoading(false);
//   };

//   return (
//     <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", md: "row" },
//           justifyContent: "center",
//           alignItems: "center",
//           flexGrow: 1,
//           p: 3,
//           gap: 3,
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <img
//             src={loginImages[currentImage]}
//             alt="Visitor Management"
//             style={{
//               width: "100%",
//               maxWidth: "400px",
//               borderRadius: "16px",
//               boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
//               transition: "opacity 0.5s ease-in-out",
//             }}
//             onError={(e) => {
//               e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Failed";
//             }}
//           />
//         </Box>

//         <Paper
//           elevation={3}
//           sx={{
//             p: 4,
//             borderRadius: 2,
//             textAlign: "center",
//             width: "350px",
//             boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//           }}
//         >
//           <form onSubmit={handleLoginSubmit}>
//             <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
//               Login
//             </Typography>
//             <TextField
//               fullWidth
//               label="Username"
//               variant="outlined"
//               margin="dense"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//             <TextField
//               fullWidth
//               label="Password"
//               variant="outlined"
//               margin="dense"
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <Button
//               fullWidth
//               variant="contained"
//               sx={{
//                 backgroundColor: "#4caf50",
//                 color: "white",
//                 mt: 2,
//                 ":hover": { backgroundColor: "#388e3c" },
//               }}
//               type="submit"
//               disabled={loginLoading}
//             >
//               {loginLoading ? "Processing..." : "SUBMIT"}
//             </Button>
//           </form>
//         </Paper>
//       </Box>
//     </Box>
//   );
// };

// export default LoginForgotPassword;
import React, { useState, useEffect } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authAPI";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  // Load images from localStorage
  const [loginImages, setLoginImages] = useState(() => {
    const storedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
    return storedImages.length > 0
      ? storedImages
      : ["https://via.placeholder.com/400x300?text=No+Image+Uploaded"]; // Default placeholder
  });

  // Effect for changing images (Auto-switch)
  useEffect(() => {
    if (loginImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImage((prev) => (prev + 1) % loginImages.length);
      }, 3000); // Change image every 3 seconds
      return () => clearInterval(interval);
    }
  }, [loginImages.length]);

  // Listen for changes in localStorage (for real-time updates)
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedImages = JSON.parse(localStorage.getItem("loginImages")) || [];
      setLoginImages(
        updatedImages.length > 0
          ? updatedImages
          : ["https://via.placeholder.com/400x300?text=No+Image+Uploaded"]
      );
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login Submission
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
        {/* Left Side - Login Image */}
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
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
              e.target.src = "https://via.placeholder.com/400x300?text=Image+Load+Failed";
            }}
          />
        </Box>

        {/* Right Side - Login Form */}
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
