import React, { useState } from "react";
import {
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", password: "password123", role: "Admin" },
    { id: 2, username: "jane_smith", password: "securepass", role: "Host" },
    { id: 3, username: "mike_jones", password: "mypassword", role: "Security" },
    { id: 4, username: "alice_brown", password: "admin123", role: "Receptionist" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    role: "",
  });

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const handleLoginOpen = () => {
    setOpenLoginDialog(true);
    setLoginError("");
  };

  const handleLoginClose = () => {
    setOpenLoginDialog(false);
    setLoginData({
      username: "",
      password: "",
      role: "",
    });
    setLoginError("");
  };

  const handleLoginInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    
    const { username, password, role } = loginData;
    
    if (!username || !password || !role) {
      setLoginError("Please fill in all fields");
      return;
    }
    
    setLoginLoading(true);
    setLoginError("");
    
    try {
      // Mock API call - replace with actual API call
      // const response = await axios.post("http://localhost:5000/api/auth/login", {
      //   username,
      //   password,
      //   role: role.toLowerCase(),
      // });
      
      // Simulating API response
      setTimeout(() => {
        // Store token in localStorage
        localStorage.setItem("token", "mock-token-123456");
        
        // Redirect based on role
        switch (role.toLowerCase()) {
          case "admin":
            navigate("/dashboard");
            break;
          case "receptionist":
            navigate("/checkin");
            break;
          case "security":
            navigate("/vehicle-details");
            break;
          case "host":
            navigate("/visitorlist");
            break;
          default:
            navigate("/");
        }
        
        setLoginLoading(false);
        handleLoginClose();
      }, 1000);
      
    } catch (error) {
      setLoginError(error.response?.data?.message || "Login Failed");
      setLoginLoading(false);
    }
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ padding: { xs: 1, sm: 2, md: 3 }, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <div style={{ 
          display: "flex", 
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between", 
          marginBottom: 20,
          gap: 10
        }}>
          <TextField
            label="Search Username"
            variant="outlined"
            fullWidth
            sx={{ mb: { xs: 2, sm: 0 }, mr: { sm: 2 } }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            value={filterRole}
            onChange={handleFilterChange}
            displayEmpty
            variant="outlined"
            sx={{ 
              minWidth: { xs: "100%", sm: 200 }, 
              mb: { xs: 2, sm: 0 }, 
              mr: { sm: 2 } 
            }}
          >
            <MenuItem value="">Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Host">Host</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
          </Select>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#5a3d91",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
              minWidth: { xs: "100%", sm: "auto" }
            }}
            onClick={handleLoginOpen}
          >
            Company Login
          </Button>
        </div>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3, overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#5a3d91" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Password</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{"*".repeat(user.password.length)}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <IconButton>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold", color: "gray" }}>
                    No User Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Company Login Dialog */}
      <Dialog 
        open={openLoginDialog} 
        onClose={handleLoginClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
              Company Login
            </Typography>
            <IconButton onClick={handleLoginClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              name="username"
              value={loginData.username}
              onChange={handleLoginInputChange}
              disabled={loginLoading}
            />
            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginInputChange}
              disabled={loginLoading}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                name="role"
                value={loginData.role}
                onChange={handleLoginInputChange}
                label="Role"
                disabled={loginLoading}
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Host">Host</MenuItem>
                <MenuItem value="Security">Security</MenuItem>
                <MenuItem value="Receptionist">Receptionist</MenuItem>
              </Select>
            </FormControl>
            {loginError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {loginError}
              </Typography>
            )}
          </form>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleLoginClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleLoginSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#5a3d91",
              color: "white",
              "&:hover": { backgroundColor: "#1565c0" },
            }}
            disabled={loginLoading}
          >
            {loginLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserList;