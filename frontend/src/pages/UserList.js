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
import Navbar from "../components/Navbar"; // Ensure this path is correct
import CompanyLogin from "./companylogin"; // Ensure correct file name and path

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
  const [selectedUser , setSelectedUser ] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openCompanyLoginDialog, setOpenCompanyLoginDialog] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser (user);
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
    setSelectedUser ({ ...selectedUser , [event.target.name]: event.target.value });
  };

  const handleSaveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === selectedUser .id ? selectedUser  : user))
    );
    setOpenEditDialog(false);
    setSnackbar({ open: true, message: "User  updated successfully!", severity: "success" });
  };

  const handleDelete = () => {
    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUser .id)
    );
    handleMenuClose();
    setSnackbar({ open: true, message: "User  deleted successfully!", severity: "success" });
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

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterRole === "" || user.role === filterRole)
  );

  return (
    <>
      {/* Remove Navbar when Company Login dialog is open */}
      {!openCompanyLoginDialog && <Navbar />}
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

        {/* Action Menu (Dropdown) */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 150 }
          }}
        >
          <MenuItem onClick={handleEdit} sx={{ color: "#5a3d91" }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "#d32f2f" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Edit User Dialog */}
        <Dialog open={openEditDialog} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ bgcolor: "#5a3d91", color: "white" }}>Edit User</DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {selectedUser  && (
              <>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  margin="normal"
                  value={selectedUser .username}
                  onChange={handleEditChange}
                />
                <TextField
                  label="Password"
                  name="password"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={selectedUser .password}
                  onChange={handleEditChange}
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
                <Select
                  name="role"
                  value={selectedUser .role}
                  onChange={handleEditChange}
                  fullWidth
                  margin="dense"
                  sx={{ mt: 2 }}
                >
                  <MenuItem value="Admin">Admin</MenuItem>
                  <MenuItem value="Host">Host</MenuItem>
                  <MenuItem value="Security">Security</MenuItem>
                  <MenuItem value="Receptionist">Receptionist</MenuItem>
                </Select>
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseEditDialog} sx={{ color: "#5a3d91" }}>Cancel</Button>
            <Button 
              onClick={handleSaveChanges} 
              variant="contained" 
              sx={{ bgcolor: "#5a3d91", "&:hover": { bgcolor: "#4a2f77" } }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Company Login Dialog */}
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
            {/* Embed your CompanyLogin component here */}
            <CompanyLogin />
          </DialogContent>
        </Dialog>

        {/* Snackbar for notifications */}
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