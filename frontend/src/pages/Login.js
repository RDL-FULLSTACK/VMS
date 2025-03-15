

//removed the forget passsword and enter button is working
import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { login } from "../api/authAPI"; // Adjust path
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForgotPassword = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Handle login
  const handleLoginSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    if (!username || !password) {
      toast.error("Enter username and password");
      return;
    }

    setLoginLoading(true);
    try {
      const response = await login(username, password); // API call to MongoDB backend
      toast.success("Login Successful!");

      // Store token and user data in localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect based on role
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
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src="/assets/login-image.jpg" alt="Visitor Management" style={{ width: "100%", maxWidth: "400px" }} />
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
              sx={{ backgroundColor: "#4caf50", color: "white", mt: 2, ":hover": { backgroundColor: "#388e3c" } }}
              type="submit" // Make the button a submit type
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