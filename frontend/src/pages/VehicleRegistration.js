import React, { useState } from "react";
import { TextField, Button, Paper, MenuItem, Typography, Dialog, DialogTitle, DialogContent } from "@mui/material";
import VehicleTicket from "../components/VehicleTicket";
import { toast } from "react-toastify";

const VehicleRegistration = ({ onAddVehicle }) => {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [ticketData, setTicketData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [errors, setErrors] = useState({ vehicleNumber: "", purpose: "" });

  const purposes = ["Delivery", "Client Visit", "Service", "Other"];

  const handleVehicleNumberChange = (e) => {
    let input = e.target.value.toUpperCase();
    input = input.replace(/[^A-Z0-9]/g, "");
    setVehicleNumber(input);
    validateField("vehicleNumber", input);
  };

  const handlePurposeChange = (e) => {
    const value = e.target.value;
    setPurpose(value);
    validateField("purpose", value);
  };

  const handleKeyPress = (e) => {
    if (!/[A-Za-z0-9]/.test(e.key)) {
      e.preventDefault();
    }
  };

  const validateField = (field, value) => {
    let tempErrors = { ...errors };
    switch (field) {
      case "vehicleNumber":
        tempErrors.vehicleNumber = value.trim() ? "" : "Vehicle number is required";
        break;
      case "purpose":
        tempErrors.purpose = value ? "" : "Purpose of visit is required";
        break;
      default:
        break;
    }
    setErrors(tempErrors);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { vehicleNumber: "", purpose: "" };

    if (!vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
      isValid = false;
    }

    if (!purpose) {
      newErrors.purpose = "Purpose of visit is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleGenerateTicket = async () => {
    if (!validateForm()) {
      toast.dismiss("register-error");
      toast.error("Please fill in all required fields!", {
        toastId: "register-error",
        autoClose: 3000,
        onOpen: () => console.log("Error toast opened"),
        onClose: () => console.log("Error toast closed"),
      });
      return;
    }

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const checkInTime = currentDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true }); // 12-hour format

    const newVehicle = {
      vehicleNumber,
      purpose,
      date,
      checkInTime,
      checkOutTime: "",
    };

    try {
      await onAddVehicle(newVehicle);
      setTicketData({ vehicleNumber, purpose, checkInTime });
      setOpenDialog(true);

      toast.dismiss("register-success");
      toast.success("E-Ticket generated successfully!", {
        toastId: "register-success",
        autoClose: 3000,
        onOpen: () => console.log("Success toast opened"),
        onClose: () => console.log("Success toast closed"),
      });
    } catch (error) {
      console.error("Error in handleGenerateTicket:", error);
      toast.dismiss("register-error");
      toast.error("Failed to generate ticket. Please try again.", {
        toastId: "register-error",
        autoClose: 3000,
      });
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTicketData(null);
    setVehicleNumber("");
    setPurpose("");
    setErrors({ vehicleNumber: "", purpose: "" });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0,0, 0.1)",
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
            label="Vehicle Number *"
            variant="outlined"
            value={vehicleNumber}
            onChange={handleVehicleNumberChange}
            onKeyPress={handleKeyPress}
            margin="normal"
            inputProps={{ maxLength: 10 }}
            error={!!errors.vehicleNumber}
            helperText={errors.vehicleNumber}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { color: errors.vehicleNumber ? "#d32f2f" : "#2D3748" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#2D3748" },
                "&:hover fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#3182CE" },
                "&.Mui-focused fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#3182CE" },
              },
              "& .MuiFormHelperText-root": { color: "#d32f2f", fontSize: "0.75rem", fontWeight: 400 },
            }}
          />
          <TextField
            fullWidth
            select
            label="Purpose of Visit *"
            variant="outlined"
            value={purpose}
            onChange={handlePurposeChange}
            margin="normal"
            error={!!errors.purpose}
            helperText={errors.purpose}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { color: errors.purpose ? "#d32f2f" : "#2D3748" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: errors.purpose ? "#d32f2f" : "#2D3748" },
                "&:hover fieldset": { borderColor: errors.purpose ? "#d32f2f" : "#3182CE" },
                "&.Mui-focused fieldset": { borderColor: errors.purpose ? "#d32f2f" : "#3182CE" },
              },
              "& .MuiFormHelperText-root": { color: "#d32f2f", fontSize: "0.75rem", fontWeight: 400 },
            }}
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
            sx={{
              mt: 2,
              py: 1.5,
              textTransform: "none",
              fontWeight: 600,
              bgcolor: "#3182CE",
              "&:hover": { bgcolor: "#2A6AA9" },
            }}
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