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
import { toast } from "react-toastify";

const VehicleCheckout = ({ vehicles, onCheckoutVehicle }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isListOpen, setIsListOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(""); // 12-hour format (e.g., "02:30 PM")
  const [checkOutTime24, setCheckOutTime24] = useState(""); // 24-hour format (e.g., "14:30")
  const wrapperRef = useRef(null);
  const [errors, setErrors] = useState({ vehicle: "", checkOutTime: "" });

  // Filter vehicles that have not been checked out and match the search query
  const filteredVehicles = vehicles.filter(
    (vehicle) =>
      vehicle.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()) &&
      vehicle.checkOutTime === ""
  );

  // Sort filtered vehicles by date and checkInTime in descending order (latest first)
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.checkInTime}`);
    const dateB = new Date(`${b.date} ${b.checkInTime}`);
    return dateB - dateA; // Descending order
  });

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setSearchQuery(vehicle.vehicleNumber);
    setIsListOpen(false);
    setErrors((prev) => ({ ...prev, vehicle: "" }));

    const now = new Date();
    const time12 = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // e.g., "02:30 PM"
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const time24 = `${hours}:${minutes}`; // e.g., "14:30"
    setCheckOutTime(time12);
    setCheckOutTime24(time24);
  };

  const handleCheckout = async () => {
    console.log("handleCheckout: Starting");
    const isValid = validateForm();
    console.log("isValid:", isValid, "selectedVehicle:", selectedVehicle, "checkOutTime:", checkOutTime);

    if (!isValid) {
      console.log("Validation failed, errors:", errors);
      toast.error("Please fill in all required fields!", {
        toastId: "checkout-error",
        autoClose: 3000,
        onOpen: () => console.log("Error toast opened"),
        onClose: () => console.log("Error toast closed"),
      });
      return;
    }

    try {
      console.log("Calling onCheckoutVehicle with:", selectedVehicle.vehicleNumber, checkOutTime);
      await onCheckoutVehicle(selectedVehicle.vehicleNumber, checkOutTime);

      console.log("Checkout successful");
      toast.success("Vehicle checked out successfully!", {
        toastId: "checkout-success",
        autoClose: 3000,
        onOpen: () => console.log("Success toast opened"),
        onClose: () => console.log("Success toast closed"),
      });

      setSelectedVehicle(null);
      setSearchQuery("");
      setCheckOutTime("");
      setCheckOutTime24("");
      setErrors({ vehicle: "", checkOutTime: "" });
      setIsListOpen(false);
    } catch (error) {
      console.error("Error in handleCheckout:", error);
      toast.error("Failed to check out vehicle. Please try again.", {
        toastId: "checkout-error",
        autoClose: 3000,
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setIsListOpen(false);
    setSelectedVehicle(null);
    setCheckOutTime("");
    setCheckOutTime24("");
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

    console.log("Validating:", { selectedVehicle, checkOutTime });
    if (!selectedVehicle) {
      newErrors.vehicle = "Vehicle is required";
      isValid = false;
    }

    if (!checkOutTime) {
      newErrors.checkOutTime = "Check-out time is required";
      isValid = false;
    }

    setErrors(newErrors);
    console.log("Validation result:", isValid, newErrors);
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
              "& fieldset": { borderColor: errors.vehicle ? "#d32f2f" : "#2D3748" },
              "&:hover fieldset": { borderColor: errors.vehicle ? "#d32f2f" : "#3182CE" },
              "&.Mui-focused fieldset": { borderColor: errors.vehicle ? "#d32f2f" : "#3182CE" },
            },
            "& .MuiFormHelperText-root": { color: "#d32f2f", fontSize: "0.75rem", fontWeight: 400 },
          }}
        />
        {isListOpen && (
          <List sx={{ maxHeight: 200, overflow: "auto", border: "1px solid #E2E8F0", borderRadius: 1, mb: 2, bgcolor: "#FFFFFF" }}>
            {sortedVehicles.length > 0 ? (
              sortedVehicles.map((vehicle) => (
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
            value={checkOutTime24}
            onChange={(e) => {
              const time24 = e.target.value; // e.g., "14:30"
              const [hours, minutes] = time24.split(":");
              const date = new Date();
              date.setHours(parseInt(hours));
              date.setMinutes(parseInt(minutes));
              const time12 = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // e.g., "02:30 PM"
              setCheckOutTime24(time24);
              setCheckOutTime(time12);
              validateField("checkOutTime", time12);
            }}
            sx={{ mb: 2 }}
            error={!!errors.checkOutTime}
            helperText={errors.checkOutTime}
            InputLabelProps={{ shrink: true, style: { color: errors.checkOutTime ? "#d32f2f" : "#2D3748" } }}
            inputProps={{ step: 300 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: errors.checkOutTime ? "#d32f2f" : "#2D3748" },
                "&:hover fieldset": { borderColor: errors.checkOutTime ? "#d32f2f" : "#3182CE" },
                "&.Mui-focused fieldset": { borderColor: errors.checkOutTime ? "#d32f2f" : "#3182CE" },
              },
              "& .MuiFormHelperText-root": { color: "#d32f2f", fontSize: "0.75rem", fontWeight: 400 },
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
            "&:hover": { bgcolor: "#2A6AA9" },
          }}
        >
          Check-Out
        </Button>
      </CardContent>
    </Card>
  );
};

export default VehicleCheckout;