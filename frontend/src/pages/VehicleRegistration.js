//VehicleRegistration.js

import React, { useState } from "react";
import { TextField, Button, Paper, MenuItem, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import VehicleTicket from "../components/VehicleTicket";

const VehicleRegistration = ({ onAddVehicle }) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const purposes = ["Delivery", "Client Visit", "Service", "Other"];

  const handleVehicleNumberChange = (e) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/[^A-Z0-9]/g, "");
    setVehicleNumber(input);
  };

  const handleKeyPress = (e) => {
    if (!/[A-Za-z0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const handleGenerateTicket = () => {
    if (!vehicleNumber || !purpose) {
      alert("Please enter all details");
      return;
    }

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const checkInTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });

    const newVehicle = {
      vehicleNumber,
      purpose,
      date,
      checkInTime,
      checkOutTime: "",
    };

    onAddVehicle(newVehicle);
    setTicketData({ vehicleNumber, purpose, checkInTime });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTicketData(null);
    setVehicleNumber("");
    setPurpose("");
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        width: "100%",
        maxWidth: 350,
        bgcolor: "#FFFFFF",
      }}
    >
      {!openDialog ? (
        <>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2D3748", mb: 2 }}>
            Register Vehicle
          </Typography>
          <TextField
            fullWidth
            label="Vehicle Number"
            variant="outlined"
            value={vehicleNumber}
            onChange={handleVehicleNumberChange}
            onKeyPress={handleKeyPress}
            margin="normal"
            inputProps={{ maxLength: 10 }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Purpose of Visit"
            variant="outlined"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            margin="normal"
            sx={{ mb: 2 }}
          >
            {purposes.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleGenerateTicket}
            sx={{ mt: 2, py: 1.5, textTransform: "none", fontWeight: 600 }}
          >
            Generate E-Ticket
          </Button>
        </>
      ) : null}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#3182CE", color: "#FFFFFF", fontWeight: 600 }}>
          Generated Vehicle Ticket
        </DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleCloseDialog} />}
        </DialogContent>
      </Dialog>
    </Paper>
  );
};

export default VehicleRegistration;