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
  DialogActions,
  Button,
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
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false); // State for confirmation dialog
  const rowsPerPage = 6;

  const handleMenuOpen = (event, vehicle) => {
    console.log("Opening menu for vehicle:", vehicle); // Debug log
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle); // Ensure vehicle is set
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Do not clear selectedVehicle here; clear it after deletion or cancellation
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
      setOpenTicketDialog(true);
      toast.dismiss();
      toast.success("Viewing ticket for the selected vehicle!", { toastId: "view-ticket" });
    } else {
      toast.error("No vehicle selected for viewing!", { toastId: "view-error" });
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked, selectedVehicle:", selectedVehicle); // Debug log
    if (selectedVehicle) {
      setOpenConfirmDialog(true); // Open confirmation dialog only if vehicle is selected
    } else {
      toast.error("No vehicle selected for deletion!", { toastId: "delete-error" });
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    console.log("Confirming deletion, selectedVehicle:", selectedVehicle); // Debug log
    if (!selectedVehicle) {
      toast.error("No vehicle selected for deletion!", { toastId: "delete-error" });
      setOpenConfirmDialog(false);
      return;
    }

    const vehicleId = selectedVehicle._id;
    if (!vehicleId) {
      console.error("Selected vehicle does not have an _id:", selectedVehicle);
      toast.error("Invalid vehicle data: No ID found!", { toastId: "delete-error" });
      setOpenConfirmDialog(false);
      setSelectedVehicle(null);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/vehicles/${vehicleId}`);
      toast.dismiss();
      toast.success("Vehicle deleted successfully!", { toastId: "delete-success" });
      if (onDeleteVehicle) {
        onDeleteVehicle(vehicleId);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete vehicle. Please try again.", {
        toastId: "delete-error",
      });
    } finally {
      setOpenConfirmDialog(false);
      setSelectedVehicle(null); // Clear selectedVehicle after deletion
    }
  };

  const handleDeleteCancel = () => {
    setOpenConfirmDialog(false);
    setSelectedVehicle(null); // Clear selectedVehicle on cancel
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setTicketData(null);
    setSelectedVehicle(null); // Clear selectedVehicle when closing ticket dialog
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

      {/* Menu for actions */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>View Ticket</MenuItem>
        <MenuItem onClick={handleDeleteClick} disabled={!selectedVehicle}>
          Delete
        </MenuItem>
      </Menu>

      {/* Ticket Dialog */}
      <Dialog open={openTicketDialog} onClose={handleCloseTicketDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3182CE", color: "#FFFFFF", fontWeight: 600 }}>
          Vehicle Ticket
        </DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleCloseTicketDialog} />}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog for Deletion */}
      <Dialog open={openConfirmDialog} onClose={handleDeleteCancel} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ bgcolor: "#f44336", color: "#FFFFFF", fontWeight: 600 }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1">
            Are you sure you want to delete the vehicle{" "}
            <strong>{selectedVehicle?.vehicleNumber || "N/A"}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default VehicleDetails;