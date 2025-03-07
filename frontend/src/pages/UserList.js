import React, { useState } from "react";
import {
  Container,
  Typography,
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
  Menu,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navbar from "../components/Navbar"; // Ensure this path is correct

const UserList = () => {
  const navigate = useNavigate(); // Initialize useNavigate
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
  const [showPassword, setShowPassword] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setOpenEditDialog(true);
    handleMenuClose();
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleEditChange = (event) => {
    setSelectedUser({ ...selectedUser, [event.target.name]: event.target.value });
  };

  const handleSaveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
    );
    setOpenEditDialog(false);
  };

  const handleDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser.id)
    );
    handleMenuClose();
  };

  const handleCompanyLogin = () => {
    navigate("/companylogin"); // Redirect to Company Login Page
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterRole === "" || user.role === filterRole)
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        {/* Search, Filter & Company Login Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <TextField
            label="Search Username"
            variant="outlined"
            fullWidth
            sx={{ mr: 2 }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            value={filterRole}
            onChange={handleFilterChange}
            displayEmpty
            variant="outlined"
            sx={{ minWidth: 200, mr: 2 }}
          >
            <MenuItem value="">Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Host">Host</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
          </Select>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#5a3d91", color: "white", "&:hover": { backgroundColor: "#4a2f77" } }}
            onClick={handleCompanyLogin}
          >
            Company Login
          </Button>
        </div>

        {/* Users Table */}
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
                      <IconButton onClick={(event) => handleMenuOpen(event, user)}>
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
    </>
  );
};

export default UserList;
