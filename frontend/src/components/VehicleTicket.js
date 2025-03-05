import React, { useRef } from "react";
import { Paper, Typography, Button, Container } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";

const VehicleTicket = ({ data, onClose }) => {
  const ticketRef = useRef(); // Reference to the ticket for printing

  if (!data) {
    return (
      <Typography variant="h6" style={{ textAlign: "center", marginTop: 20 }}>
        Error: No Ticket Data Found
      </Typography>
    );
  }

  const { vehicleNumber, purpose, checkInTime } = data;

  const handlePrint = () => {
    const qrCanvas = document.querySelector("canvas"); // Get the QR code canvas
    const qrCodeDataUrl = qrCanvas.toDataURL(); // Convert QR to image
  
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Ticket</title>
          <style>
            @page {
              size: A4;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: white;
            }
            .ticket-container {
              width: 90%;
              height: 90vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              text-align: center;
              border: none;
            }
            .ticket-box {
              width: 80%;
              max-width: 900px;
              padding: 60px;
              background: white;
              border: 2px solid #ddd;
              border-radius: 10px;
              box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
              font-size: 32px;
              margin-bottom: 15px;
            }
            img {
              width: 200px;
              height: 200px;
              margin: 15px 0;
            }
            p {
              font-size: 22px;
              margin: 8px 0;
            }
            hr {
              margin: 15px 0;
              width: 100%;
            }
            .footer-text {
              font-size: 18px;
              margin-top: 20px;
              font-style: italic;
            }
          </style>
        </head>
        <body>
          <div class="ticket-container">
            <div class="ticket-box">
              <h2>Vehicle E-Ticket</h2>
              <div>
                <img src="${qrCodeDataUrl}" />
              </div>
              <p>Scan this QR code at the entrance</p>
              <hr />
              <p><strong>Date & Time:</strong> ${checkInTime}</p>
              <p><strong>Vehicle Number:</strong> ${vehicleNumber}</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
              <p class="footer-text">This ticket is valid for one-time entry only.</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };  

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        padding: "20px",
      }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Vehicle E-Ticket
      </Typography>

      {/* Ticket Container */}
      <Paper
        elevation={3}
        ref={ticketRef}
        id="ticket-print"
        style={{
          padding: 20,
          width: "350px",
          textAlign: "center",
          borderRadius: 10,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <QRCodeCanvas value={vehicleNumber} size={150} />

        <Typography variant="body2" style={{ marginTop: 10, marginBottom: 10 }}>
          Scan this QR code during exit.
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
          This ticket is valid for one-time use only.
        </Typography>
      </Paper>

      {/* Print & Close Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "15px", width: "100%", maxWidth: "360px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          style={{
            flex: 1,
            padding: "10px",
            fontWeight: "bold",
          }}
        >
          Print Ticket
        </Button>

        <Button
          variant="outlined"
          color="secondary"
          onClick={onClose}
          style={{
            flex: 1,
            padding: "10px",
            fontWeight: "bold",
            border: "2px solid #a23d8e",
            color: "#a23d8e",
          }}
        >
          Close
        </Button>
      </div>
    </Container>
  );
};

export default VehicleTicket;
