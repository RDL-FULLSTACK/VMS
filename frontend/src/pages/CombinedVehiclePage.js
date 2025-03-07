import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from "@mui/material";
import Navbar from "../components/Navbar";
import VehicleDetails from "./VehicleDetails";
import VehicleRegistration from "./VehicleRegistration";
import VehicleCheckout from "./VehicleCheckout";

const CombinedVehiclePage = () => {
  const [view, setView] = useState(0); // 0 for Registration, 1 for Checkout
  const [vehicles, setVehicles] = useState([
    { id: 1, vehicleNumber: "KA19MF1476", purpose: "Delivery", date: "2025-03-01", checkInTime: "10:30 AM", checkOutTime: "02:30 PM" },
    { id: 2, vehicleNumber: "MH04AB2025", purpose: "Client Visit", date: "2025-03-01", checkInTime: "11:15 AM", checkOutTime: "03:45 PM" },
    { id: 3, vehicleNumber: "DL10CD5621", purpose: "Service", date: "2025-03-01", checkInTime: "12:45 PM", checkOutTime: "" },
    { id: 4, vehicleNumber: "KA19MF1477", purpose: "Delivery", date: "2025-03-01", checkInTime: "02:00 PM", checkOutTime: "06:00 PM" },
    { id: 5, vehicleNumber: "MH04AB2026", purpose: "Client Visit", date: "2025-03-01", checkInTime: "03:30 PM", checkOutTime: "" },
    { id: 6, vehicleNumber: "DL10CD5622", purpose: "Service", date: "2025-03-02", checkInTime: "09:00 AM", checkOutTime: "01:30 PM" },
    { id: 7, vehicleNumber: "KA19MF1478", purpose: "Delivery", date: "2025-03-02", checkInTime: "10:16 AM", checkOutTime: "" },
    { id: 8, vehicleNumber: "MH04AB2027", purpose: "Client Visit", date: "2025-03-02", checkInTime: "11:00 AM", checkOutTime: "02:00 PM" },
    { id: 9, vehicleNumber: "DL10CD5623", purpose: "Service", date: "2025-03-02", checkInTime: "01:30 PM", checkOutTime: "" },
    { id: 10, vehicleNumber: "KA19MF1479", purpose: "Delivery", date: "2025-03-02", checkInTime: "04:00 PM", checkOutTime: "07:30 PM" },
    { id: 11, vehicleNumber: "MH04AB2028", purpose: "Client Visit", date: "2025-03-03", checkInTime: "08:45 AM", checkOutTime: "12:00 PM" },
    { id: 12, vehicleNumber: "DL10CD5624", purpose: "Service", date: "2025-03-03", checkInTime: "10:00 AM", checkOutTime: "" },
    { id: 13, vehicleNumber: "KA19MF1480", purpose: "Delivery", date: "2025-03-03", checkInTime: "11:30 AM", checkOutTime: "03:00 PM" },
    { id: 14, vehicleNumber: "MH04AB2029", purpose: "Client Visit", date: "2025-03-03", checkInTime: "02:15 PM", checkOutTime: "" },
    { id: 15, vehicleNumber: "DL10CD5625", purpose: "Service", date: "2025-03-03", checkInTime: "04:00 PM", checkOutTime: "07:00 PM" },
    { id: 16, vehicleNumber: "KA19MF1481", purpose: "Delivery", date: "2025-03-04", checkInTime: "07:30 AM", checkOutTime: "11:30 AM" },
    { id: 17, vehicleNumber: "MH04AB2030", purpose: "Client Visit", date: "2025-03-04", checkInTime: "09:15 AM", checkOutTime: "" },
    { id: 18, vehicleNumber: "DL10CD5626", purpose: "Service", date: "2025-03-04", checkInTime: "12:00 PM", checkOutTime: "03:30 PM" },
    { id: 19, vehicleNumber: "KA19MF1482", purpose: "Delivery", date: "2025-03-04", checkInTime: "02:45 PM", checkOutTime: "" },
    { id: 20, vehicleNumber: "MH04AB2031", purpose: "Client Visit", date: "2025-03-05", checkInTime: "08:00 AM", checkOutTime: "12:45 PM" },
    { id: 21, vehicleNumber: "DL10CD5627", purpose: "Service", date: "2025-03-05", checkInTime: "10:30 AM", checkOutTime: "" },
    { id: 22, vehicleNumber: "KA19MF1483", purpose: "Delivery", date: "2025-03-05", checkInTime: "01:00 PM", checkOutTime: "04:30 PM" },
    { id: 23, vehicleNumber: "MH04AB2032", purpose: "Client Visit", date: "2025-03-05", checkInTime: "03:15 PM", checkOutTime: "" },
    { id: 24, vehicleNumber: "DL10CD5628", purpose: "Service", date: "2025-03-06", checkInTime: "09:00 AM", checkOutTime: "01:00 PM" },
    { id: 25, vehicleNumber: "KA19MF1484", purpose: "Delivery", date: "2025-03-06", checkInTime: "11:00 AM", checkOutTime: "" },
    { id: 26, vehicleNumber: "MH04AB2033", purpose: "Client Visit", date: "2025-03-06", checkInTime: "02:00 PM", checkOutTime: "05:30 PM" },
    { id: 27, vehicleNumber: "DL10CD5629", purpose: "Service", date: "2025-03-07", checkInTime: "08:30 AM", checkOutTime: "" },
    { id: 28, vehicleNumber: "KA19MF1485", purpose: "Delivery", date: "2025-03-07", checkInTime: "10:45 AM", checkOutTime: "02:15 PM" },
    { id: 29, vehicleNumber: "MH04AB2034", purpose: "Client Visit", date: "2025-03-07", checkInTime: "01:30 PM", checkOutTime: "" },
    { id: 30, vehicleNumber: "DL10CD5630", purpose: "Service", date: "2025-03-07", checkInTime: "03:45 PM", checkOutTime: "07:00 PM" },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");

  const handleViewChange = (event, newValue) => {
    setView(newValue);
  };

  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
  };

  const handleCheckoutVehicle = (vehicleNumber, checkOutTime) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.vehicleNumber === vehicleNumber
          ? { ...vehicle, checkOutTime }
          : vehicle
      )
    );
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    const matchesSearch = vehicle.vehicleNumber
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPurpose = filterPurpose ? vehicle.purpose === filterPurpose : true;
    const matchesDate = filterDate ? vehicle.date === filterDate : true;
    const matchesCheckOut =
      filterCheckOut === "checkedOut"
        ? vehicle.checkOutTime !== ""
        : filterCheckOut === "notCheckedOut"
          ? vehicle.checkOutTime === ""
          : true;
    return matchesSearch && matchesPurpose && matchesDate && matchesCheckOut;
  });

  return (
    <>
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on mobile, row on medium and up
          gap: { xs: 2, md: 3 },
          p: { xs: 1, md: 3 },
          bgcolor: "#F5F7FA",
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          maxWidth: "100vw",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: { xs: 1, md: 1 }, // Full width on mobile, 40% on desktop
            minWidth: 0,
            maxWidth: { md: "40%" },
            order: { xs: 1, md: 2 }, // Move to top on mobile, second on desktop
            mt: { xs: 0, md: 0 }, // No top margin on mobile
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 2 },
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            <Tabs
              value={view}
              onChange={handleViewChange}
              variant="fullWidth"
              sx={{
                mb: { xs: 1, md: 2 },
                "& .MuiTabs-indicator": {
                  height: 3,
                  bgcolor: "#3182CE",
                },
              }}
            >
              <Tab
                label="Vehicle Registration"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: { xs: "0.875rem", md: "1rem" } }}
              />
              <Tab
                label="Vehicle Checkout"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: { xs: "0.875rem", md: "1rem" } }}
              />
            </Tabs>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 1, md: 2 },
              }}
            >
              {view === 0 ? (
                <VehicleRegistration onAddVehicle={handleAddVehicle} />
              ) : (
                <VehicleCheckout
                  vehicles={filteredVehicles}
                  onCheckoutVehicle={handleCheckoutVehicle}
                />
              )}
            </Box>
          </Paper>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: { xs: 1, md: 2 }, // Full width on mobile, 60% on desktop
            minWidth: 0,
            maxWidth: { md: "60%" },
            order: { xs: 2, md: 1 }, // Move to bottom on mobile, first on desktop
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, md: 3 },
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#FFFFFF",
              overflow: "hidden",
              maxWidth: "100%",
            }}
          >
            {/* Vehicle List */}
            <Typography
              variant={{ xs: "h6", md: "h5" }} // Smaller header on mobile
              gutterBottom
              sx={{ fontWeight: 700, color: "#2D3748", mb: { xs: 1, md: 2 } }}
            >
              Vehicle List
            </Typography>

            {/* Filter Row with Background */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, md: 2 },
                mb: { xs: 2, md: 3 },
                p: { xs: 1, md: 2 },
                borderRadius: 1,
                bgcolor: "#EDEEF2",
                flexWrap: "wrap", // Wrap on all screen sizes
                alignItems: "center",
                boxSizing: "border-box",
              }}
            >
              <TextField
                size="small"
                label="Search Vehicle"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: { xs: 1, md: "auto" },
                  minWidth: { xs: "100%", md: 150 },
                  bgcolor: "white",
                  mb: { xs: 1, md: 0 },
                }}
              />
              <FormControl
                size="small"
                sx={{
                  flex: { xs: 1, md: "auto" },
                  minWidth: { xs: "100%", md: 150 }, // Ensure minimum width
                  bgcolor: "white",
                  mb: { xs: 1, md: 0 },
                }}
              >
                <InputLabel>Purpose</InputLabel>
                <Select
                  label="Filter by Purpose"
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      paddingRight: "32px", // Increase padding to avoid icon overlap
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Delivery">Delivery</MenuItem>
                  <MenuItem value="Client Visit">Client Visit</MenuItem>
                  <MenuItem value="Service">Service</MenuItem>
                </Select>
              </FormControl>
              <TextField
                size="small"
                label="Filter by Date"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                sx={{
                  flex: { xs: 1, md: "auto" },
                  minWidth: { xs: "100%", md: 150 },
                  bgcolor: "white",
                  mb: { xs: 1, md: 0 },
                }}
              />
              <FormControl
                size="small"
                sx={{
                  flex: { xs: 1, md: "auto" },
                  minWidth: { xs: "100%", md: 150 },
                  bgcolor: "white",
                  mb: { xs: 1, md: 0 },
                }}
              >
                <InputLabel>Filter by Check-Out</InputLabel>
                <Select
                  label="Filter by Check-Out"
                  value={filterCheckOut}
                  onChange={(e) => setFilterCheckOut(e.target.value)}
                  sx={{
                    "& .MuiSelect-select": {
                      paddingRight: "32px", // Increase padding to avoid icon overlap
                    },
                  }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="checkedOut">Checked Out</MenuItem>
                  <MenuItem value="notCheckedOut">Not Checked Out</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ flex: 1, overflow: "auto", borderTop: "1px solid #E2E8F0" }}>
              <VehicleDetails vehicles={filteredVehicles} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default CombinedVehiclePage;