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
    // Allow only alphanumeric characters and limit length to 10
    input = input.replace(/[^A-Z0-9]/g, "").slice(0, 10);
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
        // Indian RTO format: 2 letters (state), 2 digits (RTO), 1-2 letters (type), 1-4 digits (number)
        const rtoFormat = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/;
        if (!value.trim()) {
          tempErrors.vehicleNumber = "Vehicle number is required";
        } else if (!rtoFormat.test(value)) {
          tempErrors.vehicleNumber = "Enter a valid Indian RTO format (e.g., MH02AB1234)";
        } else {
          tempErrors.vehicleNumber = "";
        }
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

    console.log("Validating:", { vehicleNumber, purpose });
    const rtoFormat = /^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{1,4}$/;
    if (!vehicleNumber.trim()) {
      newErrors.vehicleNumber = "Vehicle number is required";
      isValid = false;
    } else if (!rtoFormat.test(vehicleNumber)) {
      newErrors.vehicleNumber = "Enter a valid Indian RTO format (e.g., MH02AB1234)";
      isValid = false;
    }

    if (!purpose) {
      newErrors.purpose = "Purpose of visit is required";
      isValid = false;
    }

    setErrors(newErrors);
    console.log("Validation result:", isValid, newErrors);
    return isValid;
  };

  const handleGenerateTicket = async () => {
    console.log("handleGenerateTicket: Starting");
    if (!validateForm()) {
      console.log("Validation failed");
      toast.error("Please fill in all required fields correctly!", {
        toastId: "register-error",
        autoClose: 3000,
        onOpen: () => console.log("Error toast opened"),
        onClose: () => console.log("Error toast closed"),
      });
      return;
    }

    const currentDate = new Date();
    const date = currentDate.toISOString().split("T")[0];
    const checkInTime = `${currentDate.getHours().toString().padStart(2, "0")}:${currentDate
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${currentDate.getHours() >= 12 ? "PM" : "AM"}`;

    const newVehicle = {
      vehicleNumber,
      purpose,
      date,
      checkInTime,
      checkOutTime: "",
    };

    console.log("Sending vehicle data to onAddVehicle:", newVehicle);

    try {
      await onAddVehicle(newVehicle);
      setTicketData({ vehicleNumber, purpose, checkInTime });
      setOpenDialog(true);
      console.log("Ticket generated successfully");
      toast.success("E-Ticket generated successfully!", {
        toastId: "register-success",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Error in handleGenerateTicket:", error.response ? error.response.data : error);
      if (error.response?.data?.message === "Vehicle is already checked in and hasn't checked out yet") {
        toast.error("This vehicle is already checked in. Please check it out first.", {
          toastId: "register-error",
          autoClose: 5000,
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to generate ticket. Please try again.", {
          toastId: "register-error",
          autoClose: 3000,
        });
      }
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
            helperText={errors.vehicleNumber || "Format: MH02AB1234"}
            sx={{
              mb: 2,
              "& .MuiInputLabel-root": { color: errors.vehicleNumber ? "#d32f2f" : "#2D3748" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#2D3748" },
                "&:hover fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#3182CE" },
                "&.Mui-focused fieldset": { borderColor: errors.vehicleNumber ? "#d32f2f" : "#3182CE" },
              },
              "& .MuiFormHelperText-root": { color: errors.vehicleNumber ? "#d32f2f" : "#666", fontSize: "0.75rem", fontWeight: 400 },
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