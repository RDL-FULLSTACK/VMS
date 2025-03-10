// VehicleCheckout.js
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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VehicleCheckout = ({ vehicles, onCheckoutVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState("");
  const wrapperRef = useRef(null);
  const [errors, setErrors] = useState({ vehicle: "", checkOutTime: "" });

  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      vehicle.checkOutTime === ""
  );

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(vehicle.vehicleNumber);
    setIsListOpen(false);
    setErrors((prev) => ({ ...prev, vehicle: "" })); // Clear vehicle error on selection

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const currentTime = `${hours}:${minutes}`;
    setCheckOutTime(currentTime);
  };

  const handleCheckout = () => {
    const isValid = validateForm();
    if (!isValid) {
      toast.error("Please fill in all required fields!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    onCheckoutVehicle(selectedVehicle.vehicleNumber, checkOutTime);
    toast.success("Vehicle checked out successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    setSelectedVehicle(null);
    setSearchQuery("");
    setCheckOutTime("");
    setErrors({ vehicle: "", checkOutTime: "" });
    setIsListOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsListOpen(false);
    setSelectedVehicle(null);
    setCheckOutTime("");
    setErrors({ vehicle: "", checkOutTime: "" });
  };

  const validateField = (field, value) => {
    let tempErrors = { ...errors };
    switch (field) {
      case "vehicle":
        tempErrors.vehicle = selectedVehicle ? "" : "Vehicle is required";
        break;
      case "checkOutTime":
        tempErrors.checkOutTime = checkOutTime ? "" : "Check-out time is required";
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { vehicle: "", checkOutTime: "" };

    if (!selectedVehicle) {
      newErrors.vehicle = "Vehicle is required";
      isValid = false;
    }

    if (!checkOutTime) {
      newErrors.checkOutTime = "Check-out time is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    validateField("vehicle", selectedVehicle);
    validateField("checkOutTime", checkOutTime);
  }, [selectedVehicle, checkOutTime]);

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
        <ToastContainer />
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "#2D3748", mb: 2 }}>
          Vehicle Check-Out
        </Typography>
        <TextField
          fullWidth
          label="Search Vehicle Number *"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsListOpen(true)}
          sx={{ mb: 2 }}
          error={!!errors.vehicle}
          helperText={errors.vehicle}
          InputProps={{
            endAdornment: searchQuery.trim().length > 0 && (
              <InputAdornment position="end">
                <IconButton aria-label="clear search" onClick={handleClearSearch} edge="end" size="small">
                  <Clear sx={{ fontSize: "16px" }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          InputLabelProps={{
            shrink: true,
            style: { color: errors.vehicle ? "#d32f2f" : "#2D3748" },
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: errors.vehicle ? "#d32f2f" : "#2D3748",
              },
              "&:hover fieldset": {
                borderColor: errors.vehicle ? "#d32f2f" : "#3182CE",
              },
              "&.Mui-focused fieldset": {
                borderColor: errors.vehicle ? "#d32f2f" : "#3182CE",
              },
            },
            "& .MuiFormHelperText-root": {
              color: "#d32f2f",
              fontSize: "0.75rem",
              fontWeight: 400,
            },
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
            label="Check-Out Time *"
            type="time"
            value={checkOutTime}
            onChange={(e) => {
              setCheckOutTime(e.target.value);
              validateField("checkOutTime", e.target.value);
            }}
            sx={{ mb: 2 }}
            error={!!errors.checkOutTime}
            helperText={errors.checkOutTime}
            InputLabelProps={{ shrink: true, style: { color: errors.checkOutTime ? "#d32f2f" : "#2D3748" } }}
            inputProps={{ step: 300 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: errors.checkOutTime ? "#d32f2f" : "#2D3748",
                },
                "&:hover fieldset": {
                  borderColor: errors.checkOutTime ? "#d32f2f" : "#3182CE",
                },
                "&.Mui-focused fieldset": {
                  borderColor: errors.checkOutTime ? "#d32f2f" : "#3182CE",
                },
              },
              "& .MuiFormHelperText-root": {
                color: "#d32f2f",
                fontSize: "0.75rem",
                fontWeight: 400,
              },
            }}
          />
        )}
        <Button
          variant="contained"
          fullWidth
          onClick={handleCheckout}
          sx={{
            mt: 2,
            py: 1.5,
            textTransform: "none",
            fontWeight: 600,
            bgcolor: "#3182CE",
            color: "#FFFFFF",
            "&:hover": {
              bgcolor: "#2A6AA9",
            },
          }}
        >
          Check-Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleCheckout;