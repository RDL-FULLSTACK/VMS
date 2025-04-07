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
import CloudUploadIcon from "@mui/icons-material/CloudUpload"; // Added for upload icon
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
  const [fileName, setFileName] = useState("No file chosen"); // Track selected file name

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name); // Update file name display

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
      setFileName("No file chosen"); // Reset file name on error
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
        setFileName("No file chosen"); // Reset file name
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
        p: { xs: 1, sm: 2 },
      }}
    >
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.0rem", md: "2.3rem" },
          color: "#2e1a47",
          background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Add User
      </Typography>

      <Box
        sx={{
          width: { xs: "90%", sm: "60%", md: 400 },
          maxWidth: "400px", // Adjusted for consistency
          p: { xs: 2, sm: 3 },
          bgcolor: "white",
          borderRadius: 5,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          mx: "auto",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
          },
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2e1a47",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2e1a47",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              },
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel
              sx={{
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              }}
            >
              Role
            </InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              label="Role"
              disabled={loading}
              sx={{
                borderRadius: "8px",
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#2e1a47",
                },
              }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2e1a47",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2e1a47",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              },
            }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                "&:hover fieldset": {
                  borderColor: "#6d4c9e",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#2e1a47",
                },
              },
              "& .MuiInputLabel-root": {
                color: "#2e1a47",
                "&.Mui-focused": {
                  color: "#2e1a47",
                },
              },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              background: "linear-gradient(45deg, #2e1a47, #6d4c9e)", // Updated to match app theme
              borderRadius: "25px",
              color: "white",
              fontWeight: "bold",
              textTransform: "none",
              py: 1,
              "&:hover": {
                background: "linear-gradient(45deg, #3f2a5d, #7e5daf)",
                transform: "scale(1.02)",
                transition: "all 0.3s ease",
              },
            }}
            disabled={loading}
          >
            {loading ? "Processing..." : "REGISTER"}
          </Button>
        </form>

        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="subtitle1"
            mb={1}
            sx={{
              fontWeight: "medium",
              color: "#2e1a47",
              background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
          >
            Or Add Users via Excel/CSV
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                background: "linear-gradient(45deg, #2e1a47, #6d4c9e)",
                borderRadius: "25px",
                textTransform: "none",
                px: { xs: 2, sm: 3 },
                py: 1,
                fontSize: { xs: "0.875rem", sm: "1rem" },
                color: "white",
                "&:hover": {
                  background: "linear-gradient(45deg, #3f2a5d, #7e5daf)",
                  transform: "scale(1.02)",
                  transition: "all 0.3s ease",
                },
              }}
              disabled={loading}
            >
              Browse
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                hidden
                onChange={handleExcelUpload}
                disabled={loading}
              />
            </Button>
            <Typography
              variant="body2"
              sx={{
                bgcolor: "#f1f3f5",
                borderRadius: "8px",
                p: 1,
                color: "#2e1a47",
                border: "1px solid #e0e0e0",
                maxWidth: "200px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CompanyRegister;