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
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import VehicleTicket from "../components/VehicleTicket";

const VehicleDetails = ({ vehicles }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
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
      setOpen(true);
    }
    handleMenuClose();
  };

  const handleDeleteVehicle = async () => {
    if (selectedVehicle && selectedVehicle._id) {
      try {
        await axios.delete(`http://localhost:5000/api/vehicles/${selectedVehicle._id}`);
        // Update the parent component's state by filtering out the deleted vehicle
        // This assumes CombinedVehiclePage will handle state updates
        window.location.reload(); // Temporary workaround; ideally, update state in parent
        handleMenuClose();
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        alert(error.response?.data?.message || "Failed to delete vehicle");
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTicketData(null); // Reset ticket data when closing
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
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
    <Box
      sx={{
        pt: { xs: 1, sm: 5, md: 0 },
        pb: { xs: 2, sm: 3, md: 4 },
        px: { xs: 2, sm: 3, md: 4 },
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
                    <TableRow key={vehicle._id || index} sx={{ height: "45px", bgcolor: index % 2 === 0 ? "#FAFAFA" : "white" }}>
                      <TableCell sx={{ fontSize: { xs: "0.8rem", sm: "0.9rem" }, padding: { xs: "6px", sm: "8px" } }}>{vehicle._id.slice(-6)}</TableCell>
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

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>Ticket</MenuItem>
        <MenuItem onClick={handleDeleteVehicle}>Delete</MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>E-Ticket</DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default VehicleDetails;