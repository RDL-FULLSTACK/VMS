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
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from '../components/Navbar';

const VehicleDetails = () => {
  const vehicles = [
    { id: 1, vehicleNumber: "KA19MF1476", purpose: "Delivery", checkIn: "2025-03-01 10:30 AM" },
    { id: 2, vehicleNumber: "MH04AB2025", purpose: "Client Visit", checkIn: "2025-03-02 11:15 AM" },
    { id: 3, vehicleNumber: "DL10CD5621", purpose: "Service", checkIn: "2025-03-03 12:45 PM" },
    { id: 4, vehicleNumber: "TN22XY6789", purpose: "Delivery", checkIn: "2025-03-04 09:30 AM" },
    { id: 5, vehicleNumber: "WB09LM4321", purpose: "Client Visit", checkIn: "2025-03-05 02:15 PM" },
    { id: 6, vehicleNumber: "HR26AB3456", purpose: "Service", checkIn: "2025-03-06 03:45 PM" },
    { id: 7, vehicleNumber: "GJ05CD7890", purpose: "Delivery", checkIn: "2025-03-07 11:00 AM" },
    { id: 8, vehicleNumber: "UP14PQ2345", purpose: "Client Visit", checkIn: "2025-03-08 04:20 PM" },
    { id: 9, vehicleNumber: "MP20JK9876", purpose: "Service", checkIn: "2025-03-09 10:50 AM" },
    { id: 10, vehicleNumber: "AP31ZX6789", purpose: "Delivery", checkIn: "2025-03-10 12:40 PM" },
    { id: 11, vehicleNumber: "RJ11UV5432", purpose: "Client Visit", checkIn: "2025-03-11 01:25 PM" },
    { id: 12, vehicleNumber: "JK10MN8765", purpose: "Service", checkIn: "2025-03-12 02:10 PM" },
    { id: 13, vehicleNumber: "KA51WX1234", purpose: "Delivery", checkIn: "2025-03-13 03:35 PM" },
    { id: 14, vehicleNumber: "MH29GH5678", purpose: "Client Visit", checkIn: "2025-03-14 04:50 PM" },
    { id: 15, vehicleNumber: "DL45KL9101", purpose: "Service", checkIn: "2025-03-15 09:15 AM" },
    { id: 16, vehicleNumber: "TN66TR3456", purpose: "Delivery", checkIn: "2025-03-16 10:10 AM" },
    { id: 17, vehicleNumber: "WB77OP6789", purpose: "Client Visit", checkIn: "2025-03-17 11:45 AM" },
    { id: 18, vehicleNumber: "HR88BC1234", purpose: "Service", checkIn: "2025-03-18 12:30 PM" },
    { id: 19, vehicleNumber: "GJ99DE5678", purpose: "Delivery", checkIn: "2025-03-19 01:40 PM" },
    { id: 20, vehicleNumber: "UP00FG9101", purpose: "Client Visit", checkIn: "2025-03-20 02:55 PM" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleMenuOpen = (event, vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurpose = filterPurpose ? vehicle.purpose === filterPurpose : true;
    const matchesDate = filterDate ? vehicle.checkIn.startsWith(filterDate) : true;
    return matchesSearch && matchesPurpose && matchesDate;
  });

  return (
    <>
      {/* Navbar Component */}
      <Navbar />

      <Box sx={{ p: 3, bgcolor: "#F3F4F6", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Paper sx={{ p: 3, width: "100%", maxWidth: "1000px", borderRadius: 2, boxShadow: 4, bgcolor: "white" }}>
          
          {/* Search & Filters */}
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap", justifyContent: "space-between" }}>
            <TextField
              size="small"
              sx={{ flex: 1, minWidth: "200px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
              label="Search Vehicle"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <FormControl size="small" sx={{ flex: 1, minWidth: "200px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}>
              <InputLabel>Filter by Purpose</InputLabel>
              <Select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)}>
                <MenuItem value="">All</MenuItem>
                <MenuItem value="Delivery">Delivery</MenuItem>
                <MenuItem value="Client Visit">Client Visit</MenuItem>
                <MenuItem value="Service">Service</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              sx={{ flex: 1, minWidth: "200px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
              label="Filter by Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </Box>

          {/* Vehicle List */}
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, bgcolor: "white" }}>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold", fontSize: "1rem", mb: 1 }}>
              Vehicle List
            </Typography>

            <TableContainer sx={{ borderRadius: 2, overflow: "hidden" }}>
              <Table size="small">
                <TableHead sx={{ bgcolor: "#EEEEEE" }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Vehicle Number</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Purpose</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Check-In Date</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem" }}>Check-In Time</TableCell>
                    <TableCell sx={{ fontWeight: "bold", fontSize: "0.8rem", textAlign: "center" }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle, index) => {
                      const [date, time] = vehicle.checkIn.split(" ");
                      return (
                        <TableRow key={vehicle.id} sx={{ height: "35px", bgcolor: index % 2 === 0 ? "#FAFAFA" : "white" }}>
                          <TableCell sx={{ fontSize: "0.8rem", padding: "6px" }}>{vehicle.id}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem", padding: "6px", fontWeight: "bold" }}>{vehicle.vehicleNumber}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem", padding: "6px" }}>{vehicle.purpose}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem", padding: "6px" }}>{date}</TableCell>
                          <TableCell sx={{ fontSize: "0.8rem", padding: "6px" }}>{time}</TableCell>
                          <TableCell sx={{ textAlign: "center", padding: "6px" }}>
                            <IconButton size="small" onClick={(event) => handleMenuOpen(event, vehicle)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ fontSize: "0.8rem", py: 1 }}>
                        No vehicles found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          {/* Action Menu */}
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
          </Menu>
        </Paper>
      </Box>
    </>
  );
};

export default VehicleDetails;