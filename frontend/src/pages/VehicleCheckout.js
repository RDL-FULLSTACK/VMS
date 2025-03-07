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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { CheckCircle, DirectionsCar, Clear } from "@mui/icons-material";
// import Navbar from "../components/Navbar";

// Sample vehicle data
const vehicles = [
    { id: 1, vehicleNumber: "KA19MF1476", purpose: "Delivery", date: "2025-03-01", checkInTime: "10:30 AM", checkOutTime: "" },
    { id: 2, vehicleNumber: "MH04AB2025", purpose: "Client Visit", date: "2025-03-02", checkInTime: "11:15 AM", checkOutTime: "" },
    { id: 3, vehicleNumber: "DL10CD5621", purpose: "Service", date: "2025-03-03", checkInTime: "12:45 PM", checkOutTime: "" },
    { id: 4, vehicleNumber: "TN22XY6789", purpose: "Delivery", date: "2025-03-04", checkInTime: "09:30 AM", checkOutTime: "" },
    { id: 5, vehicleNumber: "WB09LM4321", purpose: "Client Visit", date: "2025-03-05", checkInTime: "02:15 PM", checkOutTime: "" },
    { id: 6, vehicleNumber: "HR26AB3456", purpose: "Service", date: "2025-03-06", checkInTime: "03:45 PM", checkOutTime: "" },
    { id: 7, vehicleNumber: "GJ05CD7890", purpose: "Delivery", date: "2025-03-07", checkInTime: "11:00 AM", checkOutTime: "" },
    { id: 8, vehicleNumber: "UP14PQ2345", purpose: "Client Visit", date: "2025-03-08", checkInTime: "04:20 PM", checkOutTime: "" },
    { id: 9, vehicleNumber: "MP20JK9876", purpose: "Service", date: "2025-03-09", checkInTime: "10:50 AM", checkOutTime: "" },
    { id: 10, vehicleNumber: "AP31ZX6789", purpose: "Delivery", date: "2025-03-10", checkInTime: "12:40 PM", checkOutTime: "" },
    { id: 11, vehicleNumber: "RJ11UV5432", purpose: "Client Visit", date: "2025-03-11", checkInTime: "01:25 PM", checkOutTime: "" },
    { id: 12, vehicleNumber: "JK10MN8765", purpose: "Service", date: "2025-03-12", checkInTime: "02:10 PM", checkOutTime: "" },
    { id: 13, vehicleNumber: "KA51WX1234", purpose: "Delivery", date: "2025-03-13", checkInTime: "03:35 PM", checkOutTime: "" },
    { id: 14, vehicleNumber: "MH29GH5678", purpose: "Client Visit", date: "2025-03-14", checkInTime: "04:50 PM", checkOutTime: "" },
    { id: 15, vehicleNumber: "DL45KL9101", purpose: "Service", date: "2025-03-15", checkInTime: "09:15 AM", checkOutTime: "" },
    { id: 16, vehicleNumber: "TN66TR3456", purpose: "Delivery", date: "2025-03-16", checkInTime: "10:10 AM", checkOutTime: "" },
    { id: 17, vehicleNumber: "WB77OP6789", purpose: "Client Visit", date: "2025-03-17", checkInTime: "11:45 AM", checkOutTime: "" },
    { id: 18, vehicleNumber: "HR88BC1234", purpose: "Service", date: "2025-03-18", checkInTime: "12:30 PM", checkOutTime: "" },
    { id: 19, vehicleNumber: "GJ99DE5678", purpose: "Delivery", date: "2025-03-19", checkInTime: "01:40 PM", checkOutTime: "" },
    { id: 20, vehicleNumber: "UP00FG9101", purpose: "Client Visit", date: "2025-03-20", checkInTime: "02:55 PM", checkOutTime: "" },
    { id: 21, vehicleNumber: "PB15RS4321", purpose: "Service", date: "2025-03-21", checkInTime: "03:20 PM", checkOutTime: "" },
    { id: 22, vehicleNumber: "OR22TU8765", purpose: "Delivery", date: "2025-03-22", checkInTime: "09:45 AM", checkOutTime: "" },
    { id: 23, vehicleNumber: "KL33VW9012", purpose: "Client Visit", date: "2025-03-23", checkInTime: "01:10 PM", checkOutTime: "" },
    { id: 24, vehicleNumber: "CH44YX5678", purpose: "Service", date: "2025-03-24", checkInTime: "02:30 PM", checkOutTime: "" },
    { id: 25, vehicleNumber: "BR55ZA1234", purpose: "Delivery", date: "2025-03-25", checkInTime: "11:20 AM", checkOutTime: "" },
  ];

const VehicleCheckout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("");
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  // Filter vehicles based on search query
  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleVehicleSelect = (vehicle) => {
    console.log("Selected vehicle and searchQuery:", { vehicle, searchQuery }); // Debugging
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

  const handleClearSearch = () => {
    console.log("Clearing search query..."); // Debugging
    setSearchQuery(""); // Clear the search bar
    setIsListOpen(false); // Close the list
    setSelectedVehicle(null); // Optional: Reset selected vehicle if desired
    setCheckOutTime(""); // Optional: Reset check-out time if desired
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
            onChange={(e) => {
              console.log("Search query changed to:", e.target.value); // Debugging
              setSearchQuery(e.target.value);
            }}
            onFocus={() => setIsListOpen(true)}
            sx={{ mb: 2 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {searchQuery.trim().length > 0 ? (
                    <IconButton
                      aria-label="clear search"
                      onClick={handleClearSearch}
                      edge="end"
                      size="small"
                      sx={{
                        visibility: "visible", // Force visibility
                        opacity: 1, // Ensure full opacity
                        display: "flex", // Ensure it’s displayed
                        padding: "4px", // Adjust padding for visibility
                      }}
                    >
                      <Clear sx={{ fontSize: "16px" }} /> {/* Explicitly set icon size */}
                    </IconButton>
                  ) : null}
                </InputAdornment>
              ),
            }}
          />
          {isListOpen && (
            <List sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #ddd", borderRadius: 4 }}>
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((vehicle) => (
                  <ListItem
                    key={vehicle.id}
                    button
                    onMouseDown={() => handleVehicleSelect(vehicle)}
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
      {/* <Navbar /> */}
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
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<VehicleCheckout />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </>
  );
};

export default VehicleCheckoutRoutes;