//VehicleDetails.js

import React, { useState } from "react";
import {
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
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VehicleTicket from "../components/VehicleTicket";

const VehicleDetails = ({ vehicles }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 9;

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
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTicketData(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const paginatedVehicles = vehicles.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <>
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
                  key={vehicle.id}
                  sx={{ bgcolor: index % 2 === 0 ? "#FFFFFF" : "#F9FAFB", height: 50 }}
                >
                  <TableCell sx={{ padding: 1.5 }}>{vehicle.id}</TableCell>
                  <TableCell sx={{ padding: 1.5, fontWeight: 500 }}>{vehicle.vehicleNumber}</TableCell>
                  <TableCell sx={{ padding: 1.5 }}>{vehicle.purpose}</TableCell>
                  <TableCell sx={{ padding: 1.5 }}>{vehicle.date}</TableCell>
                  <TableCell sx={{ padding: 1.5 }}>{vehicle.checkInTime}</TableCell>
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
        <TablePagination
          component="div"
          count={vehicles.length}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[]}
          sx={{ borderTop: "1px solid #E2E8F0", fontSize: "0.875rem", color: "#4A5568" }}
        />
      </TableContainer>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleViewTicket}>View Ticket</MenuItem>
        <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
      </Menu>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3182CE", color: "#FFFFFF", fontWeight: 600 }}>
          Vehicle Ticket
        </DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleDetails;