import React, { useState } from "react";
import { TextField, Button, Container, Paper, MenuItem } from "@mui/material";
import VehicleTicket from "../components/VehicleTicket";
import Navbar from '../components/Navbar';

const VehicleRegistration = () => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ticketData, setTicketData] = useState(null);

  const purposes = ["Delivery", "Client Visit", "Service", "Other"];

  // Handle vehicle number input
  const handleVehicleNumberChange = (e) => {
    let input = e.target.value.toUpperCase(); // Convert to uppercase
    input = input.replace(/[^A-Z0-9]/g, ""); // Remove special characters and spaces
    setVehicleNumber(input);
  };

  // Prevent special characters from being typed
  const handleKeyPress = (e) => {
    if (!/[A-Za-z0-9]/.test(e.key)) {
      e.preventDefault(); // Block invalid characters
    }
  };

  const handleGenerateTicket = () => {
    if (!vehicleNumber || !purpose) {
      alert("Please enter all details");
      return;
    }

    const checkInTime = new Date().toLocaleString();
    setTicketData({ vehicleNumber, purpose, checkInTime });
  };

  return (
    <>
      {/* Navbar Component */}
      <Navbar />

      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 64px)", // Adjust for Navbar height (assuming default AppBar height)
          paddingTop: "64px", // Ensure content isn't hidden behind Navbar
        }}
      >
        {!ticketData ? (
          <Paper
            elevation={3}
            style={{
              padding: 20,
              maxWidth: 400,
              textAlign: "center",
              borderRadius: 10,
            }}
          >
            {/* Vehicle Number Input */}
            <TextField
              fullWidth
              label="Vehicle Number"
              variant="outlined"
              value={vehicleNumber}
              onChange={handleVehicleNumberChange}
              onKeyPress={handleKeyPress} // Prevent invalid inputs
              margin="normal"
              inputProps={{ maxLength: 10 }} // Limit input length
            />

            {/* Purpose Dropdown */}
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
        ) : (
          <VehicleTicket data={ticketData} />
        )}
      </Container>
    </>
  );
};

export default VehicleRegistration;