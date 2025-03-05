import React, { useState, useRef, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { CheckCircle, DirectionsCar } from "@mui/icons-material";
import Navbar from "../components/Navbar";

// Sample vehicle data
const vehicles = [
  { id: 1, vehicleNumber: "KA19MF1476", purpose: "Delivery", date: "2025-03-01", checkInTime: "10:30 AM", checkOutTime: "" },
  { id: 2, vehicleNumber: "MH04AB2025", purpose: "Client Visit", date: "2025-03-02", checkInTime: "11:15 AM", checkOutTime: "" },
  { id: 3, vehicleNumber: "DL10CD5621", purpose: "Service", date: "2025-03-03", checkInTime: "12:45 PM", checkOutTime: "" },
  { id: 4, vehicleNumber: "TN22XY6789", purpose: "Delivery", date: "2025-03-04", checkInTime: "09:30 AM", checkOutTime: "" },
  { id: 5, vehicleNumber: "WB09LM4321", purpose: "Client Visit", date: "2025-03-05", checkInTime: "02:15 PM", checkOutTime: "" },
];

const VehicleCheckout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false); // Replace isSearchFocused with isListOpen
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("");
  const navigate = useNavigate();
  const wrapperRef = useRef(null); // Ref for the entire component to detect outside clicks

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(vehicle.vehicleNumber); // Autofill the search bar with the selected vehicle number
    setIsListOpen(false); // Close the list immediately

    // Set the check-out time to the current time
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setCheckOutTime(currentTime);
  };

  const handleCheckout = () => {
    if (selectedVehicle && checkOutTime) {
      const updatedVehicle = { ...selectedVehicle, checkOutTime };
      console.log("Checked out vehicle:", updatedVehicle); // For debugging
      navigate("/success");
    }
  };

  // Handle clicks outside to close the list
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
    <Container maxWidth="md" sx={{ mt: { xs: 3, sm: 5 }, display: "flex", justifyContent: "center" }}>
      <Card ref={wrapperRef} sx={{ width: "100%", maxWidth: 500, p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Vehicle Check-Out
          </Typography>
          <TextField
            fullWidth
            label="Search Vehicle Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsListOpen(true)} // Open list on focus
            sx={{ mb: 2 }}
          />
          {isListOpen && (
            <List sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #ddd", borderRadius: 4 }}>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <ListItem
                    key={vehicle.id}
                    button
                    onMouseDown={() => handleVehicleSelect(vehicle)} // Use mousedown instead of click
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
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                p: 2,
                boxShadow: 1,
                mb: 2,
                mt: 2,
              }}
            >
              <Avatar sx={{ width: { xs: 50, sm: 80 }, height: { xs: 50, sm: 80 }, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}>
                <DirectionsCar fontSize="large" />
              </Avatar>
              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography><strong>Vehicle Number:</strong> {selectedVehicle.vehicleNumber}</Typography>
                <Typography><strong>Purpose:</strong> {selectedVehicle.purpose}</Typography>
                <Typography><strong>Date:</strong> {selectedVehicle.date}</Typography>
                <Typography><strong>Check-In Time:</strong> {selectedVehicle.checkInTime}</Typography>
              </Box>
            </Card>
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
              inputProps={{ step: 300 }} // 5-minute intervals
            />
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: "#3f51b5",
              color: "#fff",
              ":hover": { backgroundColor: "#303f9f" },
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
            disabled={!selectedVehicle || !checkOutTime}
            onClick={handleCheckout}
          >
            Check-Out
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

const SuccessPage = () => {
  return (
    <>
      <Navbar />
      <Container
        maxWidth="md"
        sx={{
          mt: 5,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <CheckCircle sx={{ fontSize: 300, color: "#4CAF50" }} />
        <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>
          Successful!
        </Typography>
      </Container>
    </>
  );
};

const VehicleCheckoutRoutes = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<VehicleCheckout />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </>
  );
};

export default VehicleCheckoutRoutes;