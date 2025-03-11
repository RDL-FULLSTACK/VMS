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
import axios from "axios";
import VehicleTicket from "../components/VehicleTicket";
import { toast } from "react-toastify";

const VehicleDetails = ({ vehicles = [], onDeleteVehicle }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(6); // Initial value, will be updated dynamically
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  // Calculate rowsPerPage dynamically based on screen size
  useEffect(() => {
    const calculateRowsPerPage = () => {
      // Approximate heights in pixels
      const rowHeight = 50; // Height of each table row (as defined in sx={{ height: 50 }})
      const headerHeight = 56; // Approximate height of the table header
      const paginationHeight = 52; // Approximate height of the pagination component
      const otherElementsHeight = 300; // Adjusted space for navbar (70px), filters (50px), margins (180px), etc.

      // Calculate available height for the table body
      const windowHeight = window.innerHeight;
      const availableHeight = windowHeight - headerHeight - paginationHeight - otherElementsHeight;

      // Calculate how many rows can fit in the available height
      let calculatedRows = Math.floor(availableHeight / rowHeight);

      // Set minimum and maximum rows for usability
      const minRows = 3; // Minimum rows to show
      const maxRows = 20; // Maximum rows to show
      calculatedRows = Math.max(minRows, Math.min(maxRows, calculatedRows));

      setRowsPerPage(calculatedRows);
    };

    // Calculate on mount
    calculateRowsPerPage();

    // Recalculate on window resize
    window.addEventListener("resize", calculateRowsPerPage);

    // Cleanup the event listener on component unmount
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
      toast.dismiss();
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

  // Sort vehicles by date and checkInTime in descending order (latest first)
  const sortedVehicles = [...vehicles].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.checkInTime}`);
    const dateB = new Date(`${b.date} ${b.checkInTime}`);
    return dateB - dateA; // Descending order
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
          height: "auto", // Allow Paper to adjust to content
          maxHeight: "100vh", // Constrain to viewport height
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Prevent page scrolling
        }}
      >
        <TableContainer
          sx={{
            flex: 1, // Take available space
            maxHeight: `calc(100vh - ${52}px - 2px)`, // Subtract pagination height and a small buffer for borders/padding
            overflow: "hidden", // Prevent internal scrolling
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

      {/* Menu for actions */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>View Ticket</MenuItem>
        <MenuItem onClick={handleDeleteClick} disabled={!selectedVehicle} sx={{ color: "red" }}>
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