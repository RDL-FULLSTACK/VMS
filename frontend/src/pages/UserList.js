import React, { useState, useEffect } from "react";
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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navbar from "../components/Navbar";
import CompanyLogin from "./companylogin";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openCompanyLoginDialog, setOpenCompanyLoginDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState({ newPassword: "", confirmPassword: "" });
  const [isMatching, setIsMatching] = useState(null); // null: initial, false: mismatch, true: match

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setSnackbar({ 
          open: true, 
          message: "Failed to load users", 
          severity: "error" 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Utility to get last 4 digits of ID
  const getLastFourDigits = (id) => {
    const idStr = (id || "").toString();
    return idStr.slice(-4);
  };

  // Utility to handle missing values
  const formatValue = (value) => {
    return value || "N/A";
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = searchQuery === "" || 
      formatValue(user.username).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "All" || 
      formatValue(user.role).toLowerCase() === filterRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

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
    const { name, value } = event.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  
    if (name === "confirmPassword" || name === "newPassword") {
      const newPassword = name === "newPassword" ? value : passwords.newPassword;
      const confirmPassword = name === "confirmPassword" ? value : passwords.confirmPassword;
  
      if (newPassword && confirmPassword) {
        setIsMatching(newPassword === confirmPassword);
      } else {
        setIsMatching(null);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...selectedUser, password: passwords.newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === selectedUser._id ? { ...user, password: passwords.newPassword } : user))
      );
      setOpenEditDialog(false);
      setPasswords({ newPassword: "", confirmPassword: "" }); // Reset password fields
      setIsMatching(null); // Reset matching status
      setSnackbar({ 
        open: true, 
        message: "User updated successfully!", 
        severity: "success" 
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({ 
        open: true, 
        message: "Failed to update user", 
        severity: "error" 
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUser._id)
      );
      handleMenuClose();
      setSnackbar({ 
        open: true, 
        message: "User deleted successfully!", 
        severity: "success" 
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({ 
        open: true, 
        message: "Failed to delete user", 
        severity: "error" 
      });
    }
  };

  const handleCompanyLogin = () => {
    setOpenCompanyLoginDialog(true);
  };

  const handleCloseCompanyLogin = () => {
    setOpenCompanyLoginDialog(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {!openCompanyLoginDialog && <Navbar />}
      <Container maxWidth="lg" sx={{ padding: 3, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
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
            variant="outlined"
            sx={{ minWidth: 200, mr: 2 }}
          >
            <MenuItem value="All">All Roles</MenuItem>
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

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#5a3d91" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Role</TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center" }}>
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user._id || "unknown"}>
                    <TableCell>{getLastFourDigits(user._id)}</TableCell>
                    <TableCell>{formatValue(user.username)}</TableCell>
                    <TableCell>{formatValue(user.role)}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuOpen(event, user)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", fontSize: "1.2rem", fontWeight: "bold", color: "gray" }}>
                    No User Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 150 }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ color: "#5a3d91", "&:hover": { backgroundColor: "#f5f5f5" } }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "#d32f2f" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#5a3d91", color: "white" }}>
            Edit User (ID: {getLastFourDigits(selectedUser?._id)})
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedUser && (
              <>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  margin="normal"
                  value={formatValue(selectedUser.username)}
                  disabled
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={passwords.newPassword}
                  onChange={handleEditChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      "&:hover fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={passwords.confirmPassword}
                  onChange={handleEditChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      "&:hover fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {isMatching === false && passwords.newPassword && passwords.confirmPassword && (
                  <p style={{ color: "red", marginTop: "5px" }}>Passwords do not match</p>
                )}
                {isMatching === true && passwords.newPassword && passwords.confirmPassword && (
                  <p style={{ color: "green", marginTop: "5px" }}>Password match successfully</p>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog} color="error">Cancel</Button>
            <Button 
              onClick={handleSaveChanges} 
              color="primary" 
              variant="contained" 
              disabled={isMatching === false || isMatching === null}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openCompanyLoginDialog} 
          onClose={handleCloseCompanyLogin} 
          maxWidth="md" 
          fullWidth
        >
          <DialogTitle sx={{ bgcolor: "#5a3d91", color: "white" }}>
            Company Login
            <IconButton
              onClick={handleCloseCompanyLogin}
              sx={{ position: 'absolute', right: 8, top: 8, color: 'white' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <CompanyLogin />
          </DialogContent>
        </Dialog>

        <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default UserList;