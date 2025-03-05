import React, { useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const VisitorList = () => {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(""); // Search filter
  const [selectedDate, setSelectedDate] = useState(""); // Date filter

  const [visitors, setVisitors] = useState([
    { id: 1, name: "John Smith", email: "john@example.com", phone: "+1 (555) 123-4567", checkIn: "09:30 AM", checkOut: "05:30 PM", host: "Sarah Wilson", designation: "Vendor", date: "2025-03-01" },
    { id: 2, name: "Emma Davis", email: "emma@example.com", phone: "+1 (555) 987-6543", checkIn: "10:15 AM", checkOut: "04:45 PM", host: "Michael Brown", designation: "Client", date: "2025-03-02" },
    { id: 3, name: "James Wilson", email: "james@example.com", phone: "+1 (555) 456-7890", checkIn: "11:00 AM", checkOut: "03:30 PM", host: "Lisa Anderson", designation: "Interview", date: "2025-03-01" },
  ]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorForMenu, setSelectedVisitorForMenu] = useState(null);

  const handleMenuOpen = (event, visitor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitorForMenu(visitor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisitorForMenu(null);
  };

  // ✅ Filtered Visitors based on search and date
  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.designation}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
      
    const matchesDate = selectedDate ? visitor.date === selectedDate : true;

    return matchesSearch && matchesDate;
  });

  return (
    <>
      <Navbar />
      <Box sx={{ p: 2, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
        <Paper sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Visitor List</Typography>

          {/* ✅ Search Bar and Date Filter */}
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Search Visitor"
              variant="outlined"
              fullWidth
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <TextField
              label="Filter by Date"
              type="date"
              variant="outlined"
              size="small"
              InputLabelProps={{ shrink: true }}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Check In</TableCell>
                  <TableCell>Check Out</TableCell>
                  <TableCell>Host</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVisitors.map((visitor) => (
                  <TableRow key={visitor.id}>
                    <TableCell>{visitor.id}</TableCell>
                    <TableCell>{visitor.name}</TableCell>
                    <TableCell>{visitor.email}</TableCell>
                    <TableCell>{visitor.phone}</TableCell>
                    <TableCell>{visitor.checkIn}</TableCell>
                    <TableCell>{visitor.checkOut}</TableCell>
                    <TableCell>{visitor.host}</TableCell>
                    <TableCell>{visitor.designation}</TableCell>
                    <TableCell>{visitor.date}</TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuOpen(event, visitor)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Three Dots Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={() => navigate(`/editcheckin/${selectedVisitorForMenu?.id}`)}>Edit Check-In</MenuItem>
          <MenuItem onClick={() => navigate(`/visitorcard/${selectedVisitorForMenu?.id}`)}>Visitor Card</MenuItem>
          <MenuItem onClick={() => {
            setVisitors(visitors.filter((v) => v.id !== selectedVisitorForMenu?.id));
            handleMenuClose();
          }} sx={{ color: "red" }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default VisitorList;
