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
  TablePagination,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Navbar from "../components/Navbar";
import VehicleTicket from "../components/VehicleTicket";

const VehicleDetails = () => {
  const vehicles = [
    { id: 1, vehicleNumber: "KA19MF1476", purpose: "Delivery", date: "2025-03-01", checkInTime: "10:30 AM", checkOutTime: "02:30 PM" },
    { id: 2, vehicleNumber: "MH04AB2025", purpose: "Client Visit", date: "2025-03-02", checkInTime: "11:15 AM", checkOutTime: "03:45 PM" },
    { id: 3, vehicleNumber: "DL10CD5621", purpose: "Service", date: "2025-03-03", checkInTime: "12:45 PM", checkOutTime: "" },
    { id: 4, vehicleNumber: "TN22XY6789", purpose: "Delivery", date: "2025-03-04", checkInTime: "09:30 AM", checkOutTime: "01:15 PM" },
    { id: 5, vehicleNumber: "WB09LM4321", purpose: "Client Visit", date: "2025-03-05", checkInTime: "02:15 PM", checkOutTime: "" },
    { id: 6, vehicleNumber: "HR26AB3456", purpose: "Service", date: "2025-03-06", checkInTime: "03:45 PM", checkOutTime: "06:00 PM" },
    { id: 7, vehicleNumber: "GJ05CD7890", purpose: "Delivery", date: "2025-03-07", checkInTime: "11:00 AM", checkOutTime: "02:45 PM" },
    { id: 8, vehicleNumber: "UP14PQ2345", purpose: "Client Visit", date: "2025-03-08", checkInTime: "04:20 PM", checkOutTime: "" },
    { id: 9, vehicleNumber: "MP20JK9876", purpose: "Service", date: "2025-03-09", checkInTime: "10:50 AM", checkOutTime: "01:30 PM" },
    { id: 10, vehicleNumber: "AP31ZX6789", purpose: "Delivery", date: "2025-03-10", checkInTime: "12:40 PM", checkOutTime: "04:15 PM" },
    { id: 11, vehicleNumber: "RJ11UV5432", purpose: "Client Visit", date: "2025-03-11", checkInTime: "01:25 PM", checkOutTime: "" },
    { id: 12, vehicleNumber: "JK10MN8765", purpose: "Service", date: "2025-03-12", checkInTime: "02:10 PM", checkOutTime: "06:30 PM" },
    { id: 13, vehicleNumber: "KA51WX1234", purpose: "Delivery", date: "2025-03-13", checkInTime: "03:35 PM", checkOutTime: "07:15 PM" },
    { id: 14, vehicleNumber: "MH29GH5678", purpose: "Client Visit", date: "2025-03-14", checkInTime: "04:50 PM", checkOutTime: "" },
    { id: 15, vehicleNumber: "DL45KL9101", purpose: "Service", date: "2025-03-15", checkInTime: "09:15 AM", checkOutTime: "12:45 PM" },
    { id: 16, vehicleNumber: "TN66TR3456", purpose: "Delivery", date: "2025-03-16", checkInTime: "10:10 AM", checkOutTime: "02:00 PM" },
    { id: 17, vehicleNumber: "WB77OP6789", purpose: "Client Visit", date: "2025-03-17", checkInTime: "11:45 AM", checkOutTime: "" },
    { id: 18, vehicleNumber: "HR88BC1234", purpose: "Service", date: "2025-03-18", checkInTime: "12:30 PM", checkOutTime: "04:45 PM" },
    { id: 19, vehicleNumber: "GJ99DE5678", purpose: "Delivery", date: "2025-03-19", checkInTime: "01:40 PM", checkOutTime: "05:15 PM" },
    { id: 20, vehicleNumber: "UP00FG9101", purpose: "Client Visit", date: "2025-03-20", checkInTime: "02:55 PM", checkOutTime: "" },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const handleMenuOpen = (event, vehicle) => {
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVehicle(null);
  };

  const handleViewTicket = () => {
    if (selectedVehicle) {
      setTicketData({
        vehicleNumber: selectedVehicle.vehicleNumber,
        purpose: selectedVehicle.purpose,
        date: selectedVehicle.date,
        checkInTime: selectedVehicle.checkInTime,
        checkOutTime: selectedVehicle.checkOutTime,
      });
    }
    handleMenuClose();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPurpose = filterPurpose ? vehicle.purpose === filterPurpose : true;
    const matchesDate = filterDate ? vehicle.date === filterDate : true;
    const matchesCheckOut =
      filterCheckOut === "checkedOut"
        ? vehicle.checkOutTime !== ""
        : filterCheckOut === "notCheckedOut"
        ? vehicle.checkOutTime === ""
        : true;
    return matchesSearch && matchesPurpose && matchesDate && matchesCheckOut;
  });

  const paginatedVehicles = filteredVehicles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
      <Navbar />
      {ticketData ? (
        <VehicleTicket data={ticketData} onClose={() => setTicketData(null)} />
      ) : (
        <Box
          sx={{
            pt: { xs: 1, sm: 5, md: 0 }, // Reduced top padding to decrease gap
            pb: { xs: 2, sm: 3, md: 4 }, // Kept bottom padding for balance
            px: { xs: 2, sm: 3, md: 4 }, // Horizontal padding remains the same
            bgcolor: "#F3F4F6",
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            sx={{
              p: { xs: 2, sm: 3, md: 4 },
              width: "100%",
              maxWidth: { xs: "100%", sm: "1200px", md: "1400px" },
              borderRadius: 3,
              boxShadow: 4,
              bgcolor: "white",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 3,
                justifyContent: "space-between",
              }}
            >
              <TextField
                size="small"
                sx={{ flex: 1, minWidth: "150px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
                label="Search Vehicle"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FormControl size="small" sx={{ flex: 1, minWidth: "150px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}>
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
                sx={{ flex: 1, minWidth: "150px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}
                label="Filter by Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />
              <FormControl size="small" sx={{ flex: 1, minWidth: "150px", bgcolor: "white", borderRadius: 1, boxShadow: 1 }}>
                <InputLabel>Filter by Check-Out</InputLabel>
                <Select value={filterCheckOut} onChange={(e) => setFilterCheckOut(e.target.value)}>
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="checkedOut">Checked Out</MenuItem>
                  <MenuItem value="notCheckedOut">Not Checked Out</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Paper sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, boxShadow: 3, bgcolor: "white", overflow: "hidden" }}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" }, mb: 2 }}
              >
                Vehicle List
              </Typography>

              <TableContainer sx={{ maxHeight: "450px", overflowX: "auto" }}>
                <Table size="medium" stickyHeader>
                  <TableHead sx={{ bgcolor: "#EEEEEE" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>Vehicle Number</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>Purpose</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>Check-In Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>Check-Out Time</TableCell>
                      <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" }, textAlign: "center" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedVehicles.length > 0 ? (
                      paginatedVehicles.map((vehicle, index) => (
                        <TableRow key={vehicle.id} sx={{ height: "45px", bgcolor: index % 2 === 0 ? "#FAFAFA" : "white" }}>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle.id}</TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" }, fontWeight: "bold" }}>{vehicle.vehicleNumber}</TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle.purpose}</TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle.date}</TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle.checkInTime}</TableCell>
                          <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle.checkOutTime || "Not Checked Out"}</TableCell>
                          <TableCell sx={{ textAlign: "center", padding: { xs: "6px", sm: "8px" } }}>
                            <IconButton size="small" onClick={(event) => handleMenuOpen(event, vehicle)}>
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>
                          No vehicles found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              <TablePagination
                component="div"
                count={filteredVehicles.length}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" } }}
              />
            </Paper>
          </Paper>
        </Box>
      )}

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>Ticket</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>
    </>
  );
};

export default VehicleDetails;