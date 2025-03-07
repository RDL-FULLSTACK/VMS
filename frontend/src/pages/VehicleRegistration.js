import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import VehicleTicket from "../components/VehicleTicket";

const VehicleRegistration = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [open, setOpen] = useState(false); // State to control the dialog

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

    const checkInTime = new Date().toLocaleString();
    setTicketData({ vehicleNumber, purpose, checkInTime });
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false);
    setTicketData(null);
    setVehicleNumber(""); // Clear vehicle number field
    setPurpose(""); // Clear purpose field
  };

  return (
    <>
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "64px",
        }}
      >
        <Paper
          elevation={3}
          style={{
            padding: 20,
            maxWidth: 400,
            textAlign: "center",
            borderRadius: 10,
          }}
        >
          <TextField
            fullWidth
            label="Vehicle Number"
            variant="outlined"
            value={vehicleNumber}
            onChange={handleVehicleNumberChange}
            onKeyPress={handleKeyPress}
            margin="normal"
            inputProps={{ maxLength: 10 }}
          />

          <TextField
            fullWidth
            select
            label="Purpose of Visit"
            variant="outlined"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            margin="normal"
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
            style={{ marginTop: 15 }}
          >
            Generate E-Ticket
          </Button>
        </Paper>
      </Container>

      {/* Dialog for E-Ticket */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>E-Ticket</DialogTitle>
        <DialogContent>
          {ticketData && <VehicleTicket data={ticketData} onClose={handleClose} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleRegistration;
