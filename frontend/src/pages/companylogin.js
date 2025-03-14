import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const CompanyRegister = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password, role } = formData;

    if (!username || !password || !role) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      // Send username, password, and role to the backend
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        role: role.toLowerCase(), // Ensure consistency with backend
      });

      toast.success("Registration Successful!");

      // Store token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect based on role
      setTimeout(() => {
        switch (response.data.user.role) {
          case "admin":
            navigate("/dashboard");
            break;
          case "receptionist":
            navigate("/checkin");
            break;
          case "security":
            navigate("/vehicle-details");
            break;
          case "employee":  // Changed from "host" to "employee"
            navigate("/visitorlist");
            break;
          default:
            navigate("/");
        }
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "50vh",
          backgroundColor: "#f5f5f5",
          p: 2,
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={3}
          sx={{ fontSize: { xs: "1.8rem", sm: "2.0rem", md: "2.3rem" } }}
        >
          Company Registration
        </Typography>

        <Box
          sx={{
            width: { xs: "80%", sm: "60%", md: 400 },
            maxWidth: "350",
            p: 3,
            bgcolor: "white",
            borderRadius: 5,
            boxShadow: 3,
            textAlign: "center",
            mx: "auto",
          }}
        >
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="dense"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="dense"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Role"
                disabled={loading}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Receptionist">Receptionist</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Employee">Employee</MenuItem>  {/* Changed from "Host" to "Employee" */}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                bgcolor: "#90EE90",
                color: "black",
                fontWeight: "bold",
                "&:hover": { bgcolor: "#7ecb7e" },
              }}
              disabled={loading}
            >
              {loading ? "Processing..." : "REGISTER"}
            </Button>
          </form>
        </Box>
      </Box>
    </>
  );
};

export default CompanyRegister;