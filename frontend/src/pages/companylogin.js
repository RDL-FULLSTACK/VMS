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

const CompanyLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
    // Handle login logic here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
        p: 2, // Add padding for smaller screens
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{ fontSize: { xs: "1.8rem", sm: "2.0rem", md: "2.3rem" } }}
      >
        Company Login
      </Typography>

      <Box
        sx={{
          width: { xs: "80%", sm: "60%", md: 400}, // Make it flexible
          maxWidth: "350", // Prevent it from getting too large
          p: 3,
          bgcolor: "white",
          borderRadius: 5,
          boxShadow: 3,
          textAlign: "center",
          mx: "auto"
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
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
            >
              <MenuItem value="Host">Host</MenuItem>
              <MenuItem value="Receptionist">Receptionist</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
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
          >
            SUBMIT
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default CompanyLogin;
