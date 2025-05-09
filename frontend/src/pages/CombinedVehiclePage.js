import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Paper,
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

const CombinedVehiclePage = () => {
  const [view, setView] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPurpose, setFilterPurpose] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterCheckOut, setFilterCheckOut] = useState("");

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
        toast.error("Failed to fetch vehicles. Please try again.", {
          toastId: "fetch-error",
          autoClose: 3000,
        });
      }
    };
    fetchVehicles();
  }, []);

  const handleViewChange = (event, newValue) => {
    setView(newValue);
  };

  const handleAddVehicle = async (newVehicle) => {
    try {
      console.log("Posting vehicle data to Axios:", newVehicle);
      const response = await axios.post("http://localhost:5000/api/vehicles", newVehicle);
      console.log("Axios response:", response.data);
      setVehicles([...vehicles, response.data.vehicle]);
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding vehicle:", error.response ? error.response.data : error);
      if (error.response?.data?.message === "Vehicle is already checked in and hasn't checked out yet") {
        toast.error("This vehicle is already checked in. Please check it out first.", {
          toastId: "register-error",
          autoClose: 5000,
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to register vehicle", {
          toastId: "register-error",
          autoClose: 3000,
        });
      }
      return Promise.reject(error);
    }
  };

  const handleCheckoutVehicle = async (vehicleNumber, checkOutTime) => {
    try {
      await axios.put("http://localhost:5000/api/vehicles/checkout", {
        vehicleNumber,
        checkOutTime,
      });
      setVehicles(
        vehicles.map((vehicle) =>
          vehicle.vehicleNumber === vehicleNumber
            ? { ...vehicle, checkOutTime }
            : vehicle
        )
      );
      return Promise.resolve();
    } catch (error) {
      console.error("Error checking out vehicle:", error);
      toast.error(error.response?.data?.message || "Failed to check out vehicle", {
        toastId: "checkout-error",
        autoClose: 3000,
      });
      return Promise.reject(error);
    }
  };

  const handleDeleteVehicle = (vehicleId) => {
    setVehicles((prevVehicles) => prevVehicles.filter((vehicle) => vehicle._id !== vehicleId));
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
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 2, md: 3 },
          p: { xs: 1, md: 3 },
          bgcolor: "#F5F7FA",
          minHeight: "calc(100vh - 64px)",
          width: "100%",
          maxWidth: "100vw",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: { xs: 1, md: 1 },
            minWidth: 0,
            maxWidth: { md: "40%" },
            order: { xs: 1, md: 2 },
            mt: { xs: 0, md: 0 },
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
                "& .MuiTabs-indicator": { height: 3, bgcolor: "#3182CE" },
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
            flex: { xs: 1, md: 2 },
            minWidth: 0,
            maxWidth: { md: "60%" },
            order: { xs: 2, md: 1 },
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
            <Box
              sx={{
                display: "flex",
                gap: { xs: 1, md: 2 },
                mb: { xs: 2, md: 3 },
                p: { xs: 1, md: 2 },
                borderRadius: 1,
                bgcolor: "#EDEEF2",
                flexWrap: "wrap",
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
                sx={{ flex: { xs: 1, md: "auto" }, minWidth: { xs: "100%", md: 150 }, bgcolor: "white", mb: { xs: 1, md: 0 } }}
              />
              <FormControl size="small" sx={{ flex: { xs: 1, md: "auto" }, minWidth: { xs: "100%", md: 150 }, bgcolor: "white", mb: { xs: 1, md: 0 } }}>
                <InputLabel>Purpose</InputLabel>
                <Select
                  label="Filter by Purpose"
                  value={filterPurpose}
                  onChange={(e) => setFilterPurpose(e.target.value)}
                  sx={{ "& .MuiSelect-select": { paddingRight: "32px" } }}
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
                sx={{ flex: { xs: 1, md: "auto" }, minWidth: { xs: "100%", md: 150 }, bgcolor: "white", mb: { xs: 1, md: 0 } }}
              />
              <FormControl size="small" sx={{ flex: { xs: 1, md: "auto" }, minWidth: { xs: "100%", md: 150 }, bgcolor: "white", mb: { xs: 1, md: 0 } }}>
                <InputLabel>Filter by Check-Out</InputLabel>
                <Select
                  label="Filter by Check-Out"
                  value={filterCheckOut}
                  onChange={(e) => setFilterCheckOut(e.target.value)}
                  sx={{ "& .MuiSelect-select": { paddingRight: "32px" } }}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="checkedOut">Checked Out</MenuItem>
                  <MenuItem value="notCheckedOut">Not Checked Out</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: 1, overflow: "auto", borderTop: "1px solid #E2E8F0" }}>
              <VehicleDetails vehicles={filteredVehicles} onDeleteVehicle={handleDeleteVehicle} />
            </Box>
          </Paper>
        </Box>
      </Box>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        limit={3}
        style={{ zIndex: 10000, position: "fixed", top: 10, right: 10 }}
      />
      <Footer/>
    </>
  );
};

export default CombinedVehiclePage;