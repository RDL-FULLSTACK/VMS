//VehicleCheckout.js

import React, { useState, useRef, useEffect } from "react";
import {
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Clear } from "@mui/icons-material";

const VehicleCheckout = ({ vehicles, onCheckoutVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("");
  const wrapperRef = useRef(null);

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      vehicle.checkOutTime === ""
  );

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(vehicle.vehicleNumber);
    setIsListOpen(false);

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setCheckOutTime(currentTime);
  };

  const handleCheckout = () => {
    if (selectedVehicle && checkOutTime) {
      onCheckoutVehicle(selectedVehicle.vehicleNumber, checkOutTime);
      setSelectedVehicle(null);
      setSearchQuery("");
      setCheckOutTime("");
      setIsListOpen(false);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsListOpen(false);
    setSelectedVehicle(null);
    setCheckOutTime("");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsListOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Card
      ref={wrapperRef}
      sx={{
        width: "100%",
        maxWidth: 350,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: 2,
        bgcolor: "#FFFFFF",
      }}
    >
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2D3748", mb: 2 }}>
          Vehicle Check-Out
        </Typography>
        <TextField
          fullWidth
          label="Search Vehicle Number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsListOpen(true)}
          sx={{ mb: 2 }}
          InputProps={{
            endAdornment: searchQuery.trim().length > 0 && (
              <InputAdornment position="end">
                <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                  <Clear sx={{ fontSize: "16px" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {isListOpen && (
          <List sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #E2E8F0", borderRadius: 1, mb: 2, bgcolor: "#FFFFFF" }}>
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => (
                <ListItem
                  key={vehicle.id}
                  button
                  onMouseDown={() => handleVehicleSelect(vehicle)}
                  sx={{ "&:hover": { bgcolor: "#F7FAFC" } }}
                >
                  <ListItemText primary={vehicle.vehicleNumber} />
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText primary="No vehicles found" />
              </ListItem>
            )}
          </List>
        )}
        {selectedVehicle && (
          <Box sx={{ mb: 2, p: 1, border: "1px solid #E2E8F0", borderRadius: 1, bgcolor: "#F9FAFB" }}>
            <Typography><strong>Vehicle Number:</strong> {selectedVehicle.vehicleNumber}</Typography>
            <Typography><strong>Purpose:</strong> {selectedVehicle.purpose}</Typography>
            <Typography><strong>Date:</strong> {selectedVehicle.date}</Typography>
            <Typography><strong>Check-In Time:</strong> {selectedVehicle.checkInTime}</Typography>
          </Box>
        )}
        {selectedVehicle && (
          <TextField
            fullWidth
            label="Check-Out Time"
            type="time"
            value={checkOutTime}
            onChange={(e) => setCheckOutTime(e.target.value)}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        )}
        <Button
          variant="contained"
          fullWidth
          color="primary"
          onClick={handleCheckout}
          disabled={!selectedVehicle || !checkOutTime}
          sx={{ mt: 2, py: 1.5, textTransform: "none", fontWeight: 600 }}
        >
          Check-Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleCheckout;