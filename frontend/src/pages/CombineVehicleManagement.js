import React, { useState } from "react";
import { FormControlLabel, Switch } from "@mui/material";
import VehicleDetails from "./VehicleDetails";
import VehicleRegistration from "./VehicleRegistration";
import VehicleCheckoutRoutes from "./VehicleCheckout";

const CombineVehicleManagement = () => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      height: "100vh",
      padding: "20px",
      gap: "20px",
    }}>
      {/* Left Side - Vehicle Details */}
      <div style={{
        flex: "2",
        padding: "20px",
        border: "2px solid #bbb",
        borderRadius: "10px",
        boxShadow: "4px 4px 10px rgba(0,0,0,0.1), -4px -4px 10px rgba(0,0,0,0.1), 4px -4px 10px rgba(0,0,0,0.1), -4px 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        minWidth: "300px"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "10px",
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#5a3d91",
          textTransform: "uppercase",
          letterSpacing: "1px",
          background: "linear-gradient(to right, rgb(61, 37, 99),rgb(61, 37, 99))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Vehicle Details</h2>
        <div style={{ flex: 1, overflow: "auto", padding: "10px" }}>
          <VehicleDetails />
        </div>
      </div>

      {/* Right Side - Manage Vehicle */}
      <div style={{
        flex: "1",
        padding: "20px",
        border: "2px solid #bbb",
        borderRadius: "10px",
        boxShadow: "4px 4px 10px rgba(0,0,0,0.1), -4px -4px 10px rgba(0,0,0,0.1), 4px -4px 10px rgba(0,0,0,0.1), -4px 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#f9f9f9",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "hidden",
        minWidth: "250px"
      }}>
        <h2 style={{
          fontSize: "1.8rem",
          fontWeight: "bold",
          color: "#5a3d91",
          textTransform: "uppercase",
          letterSpacing: "1px",
          background: "linear-gradient(to right, rgb(61, 37, 99),rgb(61, 37, 99))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>Manage Vehicle</h2>

        {/* Toggle Switch */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
          width: "100%",
        }}>
          <span style={{ fontWeight: isChecked ? "normal" : "bold" }}>Register</span>
          <FormControlLabel
            control={
              <Switch
                checked={isChecked}
                onChange={handleToggle}
                color={isChecked ? "success" : "primary"}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": { color: "#5a3d91" },
                  "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#5a3d91" },
                  "& .MuiSwitch-switchBase": { color: "#5a3d91" },
                  "& .MuiSwitch-switchBase + .MuiSwitch-track": { backgroundColor: "#5a3d91" },
                }}
              />
            }
            label=""
          />
          <span style={{ fontWeight: isChecked ? "bold" : "normal" }}>Checkout</span>
        </div>

        {/* Content Based on Switch State */}
        <div style={{
          flex: 1,
          overflow: "hidden",
          width: "100%",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
        }}>
          <div style={{ overflow: "auto", flex: 1 }}>
            {isChecked ? <VehicleCheckoutRoutes /> : <VehicleRegistration />}
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style>
        {`
          @media (max-width: 768px) {
            div[style*="display: flex"] {
              flex-direction: column !important;
              height: auto !important;
            }
            div[style*="flex: 2"] {
              flex: 1 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default CombineVehicleManagement;
