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
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserList = () => {
  const [users, setUsers] = useState([
    { id: 1, username: "john_doe", password: "password123", role: "Admin" },
    { id: 2, username: "jane_smith", password: "securepass", role: "Host" },
    { id: 3, username: "mike_jones", password: "mypassword", role: "Security" },
    { id: 4, username: "alice_brown", password: "admin123", role: "Receptionist" },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSaveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
    );
    setSnackbarMessage("User details updated successfully!");
    setOpenSnackbar(true);
    setOpenEditDialog(false);
  };

  const handleDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser.id)
    );
    setSnackbarMessage("User deleted successfully!");
    setOpenSnackbar(true);
    handleMenuClose();
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterRole === "" || user.role === filterRole)
  );

  return (
    <>
      <Navbar /> {/* Add Navbar here */}
      <Container maxWidth="lg" sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
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
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="">Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Host">Host</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
          </Select>
        </div>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
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

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField fullWidth label="Username" name="username" value={selectedUser?.username || ""} onChange={handleEditChange} margin="dense" />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={selectedUser?.password || ""}
              onChange={handleEditChange}
              margin="dense"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Select fullWidth name="role" value={selectedUser?.role || ""} onChange={handleEditChange} margin="dense">
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Host">Host</MenuItem>
              <MenuItem value="Security">Security</MenuItem>
              <MenuItem value="Receptionist">Receptionist</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Cancel</Button>
            <Button onClick={handleSaveChanges} color="primary">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default UserList;
