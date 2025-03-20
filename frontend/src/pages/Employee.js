import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  styled,
  TextField,
  MenuItem,
  Box,
  TablePagination,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [page, setPage] = useState(0); // Current page
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page
  const [departments, setDepartments] = useState([]); // Dynamic departments from database
  const [roles, setRoles] = useState([]); // Dynamic roles from database

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch employees");
        }
        const data = await response.json();
        setEmployees(data);
        setFilteredEmployees(data); // Initially show all employees

        // Extract unique departments from the data
        const uniqueDepartments = [
          ...new Set(data.map((employee) => employee.department?.toLowerCase())),
        ].filter(Boolean); // Remove undefined/null departments
        setDepartments(uniqueDepartments);

        // Extract unique roles from the data
        const uniqueRoles = [...new Set(data.map((employee) => employee.role?.toLowerCase()))].filter(
          Boolean
        ); // Remove undefined/null roles
        setRoles(uniqueRoles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees based on search and dropdown selections
  useEffect(() => {
    let result = employees;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (employee) =>
          employee.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          employee.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply department filter
    if (selectedDepartment) {
      result = result.filter((employee) =>
        employee.department?.toLowerCase() === selectedDepartment.toLowerCase()
      );
    }

    // Apply role filter
    if (selectedRole) {
      result = result.filter((employee) =>
        employee.role?.toLowerCase() === selectedRole.toLowerCase()
      );
    }

    setFilteredEmployees(result);
    setPage(0); // Reset to first page when filters change
  }, [searchQuery, selectedDepartment, selectedRole, employees]);

  const getLastFourDigits = (id) => {
    const idStr = (id || "").toString();
    return idStr.slice(-4);
  };

  const formatValue = (value) => {
    return value || "N/A";
  };

  const formatTimestamp = (timestamp) => {
    return timestamp ? new Date(timestamp).toLocaleString() : "N/A";
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page when rows per page changes
  };

  return (
    <>
      <Navbar />
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
          mt: 4,
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ color: "#5a3d91" }}>
          Employee Details
        </Typography>

        {/* Search and Filter Controls */}
        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
          <TextField
            label="Search by Username or Email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ minWidth: 200, flexGrow: 1 }}
            variant="outlined"
          />
          <TextField
            select
            label="Filter by Department"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="outlined"
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Filter by Role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            sx={{ minWidth: 200 }}
            variant="outlined"
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </MenuItem>
            ))}
          </TextField>
        </Box>

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
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Updated At</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 2 }}>
                    <Typography variant="h6" color="text.secondary">
                      Loading...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="error">
                      {error}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : filteredEmployees.length > 0 ? (
                filteredEmployees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <StyledTableRow key={employee._id || "unknown"}>
                      <TableCell sx={{ padding: 1.5 }}>{getLastFourDigits(employee._id)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatValue(employee.username)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatValue(employee.role)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatValue(employee.department)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatValue(employee.email)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatValue(employee.phone_no)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatTimestamp(employee.createdAt)}</TableCell>
                      <TableCell sx={{ padding: 1.5 }}>{formatTimestamp(employee.updatedAt)}</TableCell>
                    </StyledTableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No Employees Found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {!loading && !error && filteredEmployees.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredEmployees.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ mt: 2 }}
          />
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Employee;