import React, { useState } from "react";
import {
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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import axios from "axios";
import VehicleTicket from "../components/VehicleTicket";
import { toast } from "react-toastify";

const VehicleDetails = ({ vehicles = [], onDeleteVehicle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const rowsPerPage = 6;

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
      toast.dismiss();
      toast.success("Viewing ticket for the selected vehicle!", { toastId: "view-ticket" });
    }
    handleMenuClose();
  };

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle || !selectedVehicle._id) {
      toast.dismiss();
      toast.error("No vehicle selected for deletion!", { toastId: "delete-error" });
      handleMenuClose();
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${selectedVehicle._id}`);
      toast.dismiss();
      toast.success("Vehicle deleted successfully!", { toastId: "delete-success" });
      if (onDeleteVehicle) {
        onDeleteVehicle(selectedVehicle._id);
      }
      handleMenuClose();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete vehicle. Please try again.", {
        toastId: "delete-error",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setTicketData(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Sort vehicles by date and checkInTime in descending order (latest first)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.checkInTime}`);
    const dateB = new Date(`${b.date} ${b.checkInTime}`);
    return dateB - dateA; // Descending order
  });

  const paginatedVehicles = sortedVehicles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
      <Paper sx={{ p: 0, borderRadius: 0, boxShadow: 0, bgcolor: "transparent" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}>
          <Table size="small" stickyHeader>
            <TableHead sx={{ bgcolor: "#EDF2F7" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "5%", bgcolor: "#EDF2F7" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "20%", bgcolor: "#EDF2F7" }}>Vehicle Number</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "20%", bgcolor: "#EDF2F7" }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "15%", bgcolor: "#EDF2F7" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "15%", bgcolor: "#EDF2F7" }}>Check-In Time</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "15%", bgcolor: "#EDF2F7" }}>Check-Out Time</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1.5, width: "10%", textAlign: "center", bgcolor: "#EDF2F7" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle, index) => (
                  <TableRow
                    key={vehicle._id || index}
                    sx={{ bgcolor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB", height: 50 }}
                  >
                    <TableCell sx={{ padding: 1.5 }}>
                      {vehicle._id ? vehicle._id.slice(-6) : "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1.5, fontWeight: 500 }}>
                      {vehicle.vehicleNumber || "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{vehicle.purpose || "N/A"}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{vehicle.date || "N/A"}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{vehicle.checkInTime || "N/A"}</TableCell>
                    <TableCell sx={{ padding: 1.5 }}>{vehicle.checkOutTime || "Not Checked Out"}</TableCell>
                    <TableCell sx={{ textAlign: "center", padding: 1.5 }}>
                      <IconButton size="small" onClick={(event) => handleMenuOpen(event, vehicle)}>
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ padding: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      No vehicles found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={vehicles?.length || 0}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{ borderTop: "1px solid #E2E8F0", fontSize: "0.875rem", color: "#4A5568" }}
        />
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>View Ticket</MenuItem>
        <MenuItem onClick={handleDeleteVehicle}>Delete</MenuItem>
      </Menu>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3182CE", color: "#FFFFFF", fontWeight: 600 }}>
          Vehicle Ticket
        </DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetails;