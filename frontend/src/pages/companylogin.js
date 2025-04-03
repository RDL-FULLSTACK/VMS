 // components/CompanyRegister.js

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
  Input,
} from "@mui/material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as XLSX from "xlsx";

const CompanyRegister = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    department: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [excelUsers, setExcelUsers] = useState(null); // Store parsed Excel/CSV data

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);

        // Validate and format the data
        const users = jsonData.map((row) => ({
          username: row.Username?.toString() || "",
          password: row.Password?.toString() || "",
          role: row.Role?.toString().toLowerCase() || "",
          department: row.Department?.toString() || "",
          email: row.Email?.toString() || "",
          phoneNumber: row.PhoneNumber?.toString() || "",
        }));

        // Basic validation for Excel data
        for (const user of users) {
          if (
            !user.username ||
            !user.password ||
            !user.role ||
            !user.department ||
            !user.email ||
            !user.phoneNumber
          ) {
            throw new Error("All fields are required in the Excel/CSV sheet");
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
            throw new Error(`Invalid email in Excel/CSV: ${user.email}`);
          }
          if (!/^\d{10}$/.test(user.phoneNumber)) {
            throw new Error(`Invalid phone number in Excel/CSV: ${user.phoneNumber}`);
          }
        }

        setExcelUsers(users); // Store the parsed users
        toast.info("Excel/CSV file loaded. Click 'REGISTER' to add users.");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error(error.message || "Failed to process Excel/CSV file");
      setExcelUsers(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      if (excelUsers) {
        // Bulk registration from Excel/CSV
        const response = await axios.post(
          "http://localhost:5000/api/auth/register-bulk",
          { users: excelUsers },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success(response.data.message || "Users added successfully!");
        setExcelUsers(null); // Clear Excel/CSV data after successful registration
        setFormData({
          username: "",
          password: "",
          role: "",
          department: "",
          email: "",
          phoneNumber: "",
        });
      } else {
        // Single user registration with form validation
        const { username, password, role, department, email, phoneNumber } = formData;

        if (!username || !password || !role || !department || !email || !phoneNumber) {
          toast.error("Please fill in all fields");
          setLoading(false);
          return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          toast.error("Please enter a valid email address");
          setLoading(false);
          return;
        }

        if (!/^\d{10}$/.test(phoneNumber)) {
          toast.error("Phone number must be 10 digits");
          setLoading(false);
          return;
        }

        await axios.post(
          "http://localhost:5000/api/auth/register",
          {
            username,
            password,
            role: role.toLowerCase(),
            department,
            email,
            phoneNumber,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success("User added successfully!");
        setFormData({
          username: "",
          password: "",
          role: "",
          department: "",
          email: "",
          phoneNumber: "",
        });
      }

      setTimeout(() => {
        if (onClose) onClose();
      }, 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add user(s)");
    } finally {
      setLoading(false);
    }
  };

  return (
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
        Add User
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
              <MenuItem value="host">Employee</MenuItem>
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Department"
            variant="outlined"
            margin="dense"
            name="department"
            value={formData.department}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="dense"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
          />
          <TextField
            fullWidth
            label="Phone Number"
            variant="outlined"
            margin="dense"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            disabled={loading}
            inputProps={{ maxLength: 10 }}
          />
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

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" mb={1}>
            Or Add Users via Excel/CSV
          </Typography>
          <Input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleExcelUpload}
            disabled={loading}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyRegister;