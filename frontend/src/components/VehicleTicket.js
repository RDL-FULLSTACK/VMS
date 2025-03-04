import React from "react";
import { Paper, Typography, Button, Container } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const VehicleTicket = ({ data }) => {
  if (!data) {
    return (
      <Typography variant="h6" style={{ textAlign: "center", marginTop: 20 }}>
        Error: No Ticket Data Found
      </Typography>
    );
  }

  const { vehicleNumber, purpose, checkInTime } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Vehicle E-Ticket
      </Typography>

      <Paper
        elevation={3}
        style={{
          padding: 20,
          maxWidth: 400,
          textAlign: "center",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <QRCodeCanvas value={vehicleNumber} size={150} />

        <Typography variant="body2" style={{ marginTop: 10, marginBottom: 10 }}>
          Scan this QR code at the entrance
        </Typography>

        <hr style={{ width: "100%", margin: "10px 0" }} />

        <Typography variant="body1" style={{ marginBottom: 5 }}>
          <strong>Date & Time:</strong> {checkInTime}
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 5 }}>
          <strong>Vehicle Number:</strong> {vehicleNumber}
        </Typography>
        <Typography variant="body1" style={{ marginBottom: 15 }}>
          <strong>Purpose:</strong> {purpose}
        </Typography>

        <Typography variant="caption" style={{ display: "block", marginBottom: 15 }}>
          This ticket is valid for one-time entry only.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          style={{ width: "100%", padding: 10 }}
        >
          Print Ticket
        </Button>
      </Paper>
    </Container>
  );
};

export default VehicleTicket;
