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
  styled,
  Typography,
  TablePagination, // Added for pagination
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CompanyRegister from "./companylogin";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: "#fff",
  fontWeight: "bold",
  backgroundColor: "#5a3d91",
  padding: theme.spacing(1.5),
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
  },
}));

const roleDisplayMap = {
  host: "Employee",
  admin: "Admin",
  receptionist: "Receptionist",
  security: "Security",
  employee: "Employee",
  Estimator: "Estimator",
};

const roleFilterMap = {
  Employee: "host",
  Admin: "admin",
  Receptionist: "receptionist",
  Security: "security",
  Estimator: "Estimator",
};

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("All");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openCompanyLoginDialog, setOpenCompanyLoginDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editFormData, setEditFormData] = useState({
    username: "",
    department: "",
    email: "",
    phoneNumber: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isMatching, setIsMatching] = useState(null);
  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      console.log("Fetched users:", data);
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setSnackbar({
        open: true,
        message: "Failed to load users",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getLastFourDigits = (id) => {
    const idStr = (id || "").toString();
    return idStr.slice(-4);
  };

  const formatValue = (value) => {
    return value || "N/A";
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page on search
  };

  const handleFilterChange = (event) => {
    setFilterRole(event.target.value);
    setPage(0); // Reset to first page on filter change
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      searchQuery === "" ||
      formatValue(user.username).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole =
      filterRole === "All" ||
      formatValue(user.role).toLowerCase() === (roleFilterMap[filterRole] || filterRole.toLowerCase());
    return matchesSearch && matchesRole;
  });

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  // Calculate the users to display on the current page
  const paginatedUsers = filteredUsers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
    setEditFormData({
      username: user.username || "",
      department: user.department || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber || "",
      newPassword: "",
      confirmPassword: "",
    });
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
    setEditFormData({
      username: "",
      department: "",
      email: "",
      phoneNumber: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsMatching(null);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmPassword" || name === "newPassword") {
      const newPassword = name === "newPassword" ? value : editFormData.newPassword;
      const confirmPassword = name === "confirmPassword" ? value : editFormData.confirmPassword;

      if (newPassword && confirmPassword) {
        setIsMatching(newPassword === confirmPassword);
      } else {
        setIsMatching(null);
      }
    }
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      const { username, department, email, phoneNumber, newPassword } = editFormData;

      const updateData = {
        username,
        department,
        email,
        phoneNumber,
      };
      if (newPassword) {
        updateData.password = newPassword;
      }

      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      const updatedUser = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === selectedUser._id ? { ...user, ...updatedUser.user } : user
        )
      );
      handleCloseEditDialog();
      setSnackbar({
        open: true,
        message: "User updated successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating user:", error);
      setSnackbar({
        open: true,
        message: "Failed to update user",
        severity: "error",
      });
    }
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/users/${selectedUser._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== selectedUser._id));
      handleCloseDeleteDialog();
      setSnackbar({
        open: true,
        message: "User deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete user",
        severity: "error",
      });
    }
  };

  const handleCompanyLogin = () => {
    setOpenCompanyLoginDialog(true);
  };

  const handleCloseCompanyLogin = () => {
    setOpenCompanyLoginDialog(false);
    fetchUsers();
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
      <Container
        maxWidth={false}
        sx={{
          padding: 2,
          backgroundColor: "#fff",
          borderRadius: 0,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          minHeight: "80vh",
          width: "100%",
          margin: 0,
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            flexWrap: "wrap",
            gap: 2,
            width: "100%",
          }}
        >
          <TextField
            label="Search Username"
            variant="outlined"
            size="small"
            sx={{ minWidth: 200, flexGrow: 1, backgroundColor: "#fff" }}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Select
            value={filterRole}
            onChange={handleFilterChange}
            variant="outlined"
            size="small"
            sx={{ minWidth: 150, backgroundColor: "#fff" }}
          >
            <MenuItem value="All">All Roles</MenuItem>
            <MenuItem value="Admin">Admin</MenuItem>
            <MenuItem value="Receptionist">Receptionist</MenuItem>
            <MenuItem value="Security">Security</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Estimator">Estimator</MenuItem>
          </Select>
          <Button
            variant="contained"
            size="medium"
            sx={{
              backgroundColor: "#5a3d91",
              color: "#fff",
              "&:hover": { backgroundColor: "#4a2f77" },
              padding: "8px 16px",
            }}
            onClick={handleCompanyLogin}
          >
            Add User
          </Button>
        </div>

        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)", overflow: "auto", width: "100%" }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Username</StyledTableCell>
                <StyledTableCell>Role</StyledTableCell>
                <StyledTableCell>Department</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone Number</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <StyledTableRow key={user._id || "unknown"}>
                    <TableCell sx={{ padding: 1.5 }}>{getLastFourDigits(user._id)}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{formatValue(user.username)}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>
                      {roleDisplayMap[user.role] || formatValue(user.role)}
                    </TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{formatValue(user.department)}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{formatValue(user.email)}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{formatValue(user.phoneNumber)}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>
                      <IconButton onClick={(event) => handleMenuOpen(event, user)} size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </StyledTableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No User Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredUsers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows": {
                color: "#5a3d91",
                fontWeight: "bold",
              },
              ".MuiTablePagination-actions button": {
                color: "#5a3d91",
              },
            }}
          />
        </TableContainer>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            elevation: 3,
            sx: { minWidth: 150, borderRadius: 1 },
          }}
        >
          <MenuItem
            onClick={handleEdit}
            sx={{ color: "#5a3d91", "&:hover": { backgroundColor: "#f5f5f5" } }}
          >
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleDeleteClick} sx={{ color: "#d32f2f" }}>
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        </Menu>

        <Dialog
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
          }}
        >
          <DialogTitle
            sx={{ bgcolor: "#5a3d91", color: "#fff", fontWeight: "bold", p: 2 }}
          >
            Edit User (ID: {getLastFourDigits(selectedUser?._id)})
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedUser && (
              <>
                <TextField
                  label="Username"
                  name="username"
                  fullWidth
                  margin="normal"
                  value={editFormData.username}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  label="Department"
                  name="department"
                  fullWidth
                  margin="normal"
                  value={editFormData.department}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  label="Email"
                  name="email"
                  fullWidth
                  margin="normal"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  label="Phone Number"
                  name="phoneNumber"
                  fullWidth
                  margin="normal"
                  value={editFormData.phoneNumber}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{ sx: { borderRadius: 1 } }}
                />
                <TextField
                  label="New Password"
                  name="newPassword"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={editFormData.newPassword}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      "&:hover fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      borderRadius: 1,
                    },
                  }}
                />
                <TextField
                  label="Confirm Password"
                  name="confirmPassword"
                  fullWidth
                  margin="normal"
                  type={showPassword ? "text" : "password"}
                  value={editFormData.confirmPassword}
                  onChange={handleEditChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      "&:hover fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: isMatching === false ? "red" : isMatching === true ? "green" : "",
                      },
                      borderRadius: 1,
                    },
                  }}
                />
                {isMatching === false && editFormData.newPassword && editFormData.confirmPassword && (
                  <Typography color="error" sx={{ mt: 1 }}>
                    Passwords do not match
                  </Typography>
                )}
                {isMatching === true && editFormData.newPassword && editFormData.confirmPassword && (
                  <Typography color="success.main" sx={{ mt: 1 }}>
                    Password match successfully
                  </Typography>
                )}
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseEditDialog} color="error" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              color="primary"
              variant="contained"
              disabled={isMatching === false || (editFormData.newPassword && isMatching === null)}
            >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
          }}
        >
          <DialogTitle
            sx={{ bgcolor: "#d32f2f", color: "#fff", fontWeight: "bold", p: 2 }}
          >
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            <Typography>
              Are you sure you want to delete the user{" "}
              <strong>{selectedUser ? formatValue(selectedUser.username) : ""}</strong> (ID:{" "}
              {selectedUser ? getLastFourDigits(selectedUser._id) : ""})? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCompanyLoginDialog}
          onClose={handleCloseCompanyLogin}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2, boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" },
          }}
        >
          <DialogTitle
            sx={{ bgcolor: "#5a3d91", color: "#fff", fontWeight: "bold", p: 2 }}
          >
            Add User
            <IconButton
              onClick={handleCloseCompanyLogin}
              sx={{ position: "absolute", right: 16, top: 16, color: "#fff" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{ p: 0 }}>
            <CompanyRegister onClose={handleCloseCompanyLogin} />
          </DialogContent>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: "100%", borderRadius: 1 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
      <Footer />
    </>
  );
};

export default UserList;