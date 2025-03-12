import React, { useState, useEffect } from "react";
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
import VisibilityIcon from "@mui/icons-material/Visibility"; // Icon for "View Ticket"
import DeleteIcon from "@mui/icons-material/Delete"; // Icon for "Delete"
import axios from "axios";
import VehicleTicket from "../components/VehicleTicket";
import { toast } from "react-toastify";

const VehicleDetails = ({ vehicles = [], onDeleteVehicle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    const calculateRowsPerPage = () => {
      const rowHeight = 50;
      const headerHeight = 56;
      const paginationHeight = 52;
      const otherElementsHeight = 230;
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - headerHeight - paginationHeight - otherElementsHeight;
      let calculatedRows = Math.floor(availableHeight / rowHeight);
      const minRows = 7;
      const maxRows = 20;
      calculatedRows = Math.max(minRows, Math.min(maxRows, calculatedRows));
      setRowsPerPage(calculatedRows);
    };

    calculateRowsPerPage();
    window.addEventListener("resize", calculateRowsPerPage);
    return () => {
      window.removeEventListener("resize", calculateRowsPerPage);
    };
  }, []);

  const handleMenuOpen = (event, vehicle) => {
    console.log("Opening menu for vehicle:", vehicle);
    setAnchorEl(event.currentTarget);
    setSelectedVehicle(vehicle);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
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
      toast.success("Viewing ticket for the selected vehicle!", { toastId: "view-ticket" });
    } else {
      toast.error("No vehicle selected for viewing!", { toastId: "view-error" });
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    console.log("Delete clicked, selectedVehicle:", selectedVehicle);
    if (selectedVehicle) {
      setOpenConfirmDialog(true);
    } else {
      toast.error("No vehicle selected for deletion!", { toastId: "delete-error" });
    }
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    console.log("Confirming deletion, selectedVehicle:", selectedVehicle);
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
      toast.success("Vehicle deleted successfully!", { toastId: "delete-success" });
      if (onDeleteVehicle) {
        onDeleteVehicle(vehicleId);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete vehicle. Please try again.", {
        toastId: "delete-error",
      });
    } finally {
      setOpenConfirmDialog(false);
      setSelectedVehicle(null);
    }
  };

  const handleDeleteCancel = () => {
    setOpenConfirmDialog(false);
    setSelectedVehicle(null);
  };

  const handleCloseTicketDialog = () => {
    setOpenTicketDialog(false);
    setTicketData(null);
    setSelectedVehicle(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Sort vehicles by creation date or a combined date-time field, falling back to date and checkInTime
  const sortedVehicles = [...vehicles].sort((a, b) => {
    // Use createdAt if available (assuming backend might provide it), otherwise combine date and checkInTime
    const timeA = a.createdAt
      ? new Date(a.createdAt)
      : new Date(`${a.date} ${a.checkInTime}`);
    const timeB = b.createdAt
      ? new Date(b.createdAt)
      : new Date(`${b.date} ${b.checkInTime}`);

    // Log for debugging
    console.log("Sorting - Vehicle A:", a.vehicleNumber, timeA.toISOString());
    console.log("Sorting - Vehicle B:", b.vehicleNumber, timeB.toISOString());

    // Sort in descending order (latest first)
    return timeB - timeA;
  });

  const paginatedVehicles = sortedVehicles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
      <Paper
        sx={{
          p: 0,
          borderRadius: 0,
          boxShadow: 0,
          bgcolor: "transparent",
          height: "auto",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <TableContainer
          sx={{
            flex: 1,
            maxHeight: `calc(100vh - ${52 + 70 + 50 + 30}px)`,
            overflowY: "auto",
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead sx={{ bgcolor: "#EDF2F7" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "8%", bgcolor: "#EDF2F7" }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "16%", bgcolor: "#EDF2F7" }}>Vehicle Number</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "16%", bgcolor: "#EDF2F7" }}>Purpose</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "16%", bgcolor: "#EDF2F7" }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "16%", bgcolor: "#EDF2F7" }}>Check-In Time</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "16%", bgcolor: "#EDF2F7" }}>Check-Out Time</TableCell>
                <TableCell sx={{ fontWeight: 700, padding: 1, width: "8%", textAlign: "center", bgcolor: "#EDF2F7" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVehicles.length > 0 ? (
                paginatedVehicles.map((vehicle, index) => (
                  <TableRow
                    key={vehicle._id || index}
                    sx={{ bgcolor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB", height: 50 }}
                  >
                    <TableCell sx={{ padding: 1 }}>
                      {vehicle._id ? vehicle._id.slice(-6) : "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1, maxWidth: "90px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontWeight: 500 }}>
                      {vehicle.vehicleNumber || "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1, maxWidth: "90px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vehicle.purpose || "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1, maxWidth: "90px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vehicle.date || "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1, maxWidth: "90px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vehicle.checkInTime || "N/A"}
                    </TableCell>
                    <TableCell sx={{ padding: 1, maxWidth: "90px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {vehicle.checkOutTime || "Not Checked Out"}
                    </TableCell>
                    <TableCell sx={{ textAlign: "center", padding: 1 }}>
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
          sx={{ borderTop: "1px solid #E2E8F0", fontSize: "0.875rem", color: "#4A5568", height: "52px" }}
        />
      </Paper>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>
          <VisibilityIcon sx={{ mr: 1, fontSize: "20px" }} />
          View Ticket
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} disabled={!selectedVehicle} sx={{ color: "red" }}>
          <DeleteIcon sx={{ mr: 1, fontSize: "20px" }} />
          Delete
        </MenuItem>
      </Menu>

      <Dialog open={openTicketDialog} onClose={handleCloseTicketDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3182CE", color: "#FFFFFF", fontWeight: 600 }}>
          Vehicle Ticket
        </DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleCloseTicketDialog} />}
        </DialogContent>
      </Dialog>

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