




import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Grid,
  Container,
  Box,
} from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import html2canvas from "html2canvas";
import Navbar from "../components/Navbar";

const VisitorCard = () => {
  const { visitorId } = useParams();
  const visitorRef = useRef(null);
  const [visitor, setVisitor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/visitors/latest";
        if (visitorId) {
          url = `http://localhost:5000/api/visitors/${visitorId}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }

        const data = await response.json();
        const visitorData = data.data || data;
        setVisitor(visitorData);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching visitor details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, [visitorId]);

  // Utility to get last 4 digits of ID
  const getLastFourDigits = (id) => {
    const idStr = (id || "").toString();
    return idStr.slice(-4);
  };

  // Format check-in time
  const formatTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  // Download E-Pass as PNG
  const downloadEPass = () => {
    html2canvas(visitorRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Visitor_E_Pass_${visitorId || "latest"}.png`;
      link.click();
    });
  };

  // Print E-Pass (include full card content)
  const printEPass = () => {
    if (!visitor) return;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Visitor E-Pass</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; }
            .e-pass { max-width: 800px; margin: auto; padding: 20px; background-color: #EDE7F6; border-radius: 8px; }
            .header { background-color: #D1C4E9; padding: 10px; border-radius: 4px; }
            img { border-radius: 50%; }
            .qr-code { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="e-pass">
            <h2 class="header">VISITOR E-PASS</h2>
            <div style="display: flex; align-items: center; gap: 20px;">
              <img src="${visitor.photoUrl || "/default-avatar.png"}" alt="Visitor Photo" width="100" height="100" />
              <div style="text-align: left;">
                <h3>${visitor.fullName}</h3>
                <p><strong>ID:</strong> ${getLastFourDigits(visitor._id)}</p>
                <p><strong>Time:</strong> ${formatTime(visitor.checkInTime || visitor.createdAt)}</p>
              </div>
            </div>
            <p><strong>Purpose:</strong> ${visitor.reasonForVisit}</p>
            <p><strong>Visitor Designation:</strong> ${visitor.designation}</p>
            <p><strong>Company:</strong> ${visitor.visitorCompany}</p>
            <p><strong>Host:</strong> ${visitor.personToVisit}</p>
            <p><strong>Host Designation:</strong> ${visitor.designation}</p>
            <p><strong>Mobile:</strong> ${visitor.phoneNumber}</p>
            <p><strong>Email:</strong> ${visitor.email}</p>
            <div class="qr-code">
              <img src="${document.querySelector("canvas").toDataURL("image/png")}" alt="QR Code" />
              <p>Scan QR CODE to verify E-pass</p>
            </div>
            <p style="color: #5F3B91; font-weight: bold;">This E-pass is valid for one-time entry only</p>
          </div>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6">Loading Visitor Details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!visitor) {
    return (
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Typography variant="h6">No Visitor Data Available</Typography>
      </Container>
    );
  }

  const visitorIdStr = getLastFourDigits(visitor._id);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
        <Card
          ref={visitorRef}
          sx={{
            maxWidth: 800,
            margin: "auto",
            p: 3,
            textAlign: "center",
            backgroundColor: "#EDE7F6",
            color: "#000",
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              fontWeight: "bold",
              backgroundColor: "#D1C4E9",
              padding: "10px",
              borderRadius: 1,
            }}
          >
            VISITOR E-PASS
          </Typography>
          <Grid
            container
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid
              item
              textAlign="left"
              sx={{ display: "flex", alignItems: "center", gap: 2 }}
            >
              <Avatar
                src={visitor.photoUrl || "/default-avatar.png"} // Updated to photoUrl
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {visitor.fullName}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {formatTime(visitor.checkInTime || visitor.createdAt)} {/* Updated time */}
                </Typography>
                <Typography variant="body2">ID: {visitorIdStr}</Typography>
              </Box>
            </Grid>
            <Grid item textAlign="left" sx={{ ml: 4 }}>
              <Typography sx={{ mt: 1 }}>
                Purpose: {visitor.reasonForVisit}
              </Typography>
              <Typography>
                Visitor Designation: {visitor.designation}
              </Typography>
              <Typography>Company Name: {visitor.visitorCompany}</Typography>
            </Grid>
          </Grid>
          <hr />
          <CardContent>
            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
            >
              <Grid item textAlign="left">
                <Typography>Host Name: {visitor.personToVisit}</Typography>
                <Typography>Host Designation: {visitor.designation}</Typography>
                <Typography>Mobile: {visitor.phoneNumber}</Typography>
                <Typography>Email: {visitor.email}</Typography>
              </Grid>
              <Grid item>
                <QRCodeCanvas value={visitor._id} size={100} />
                <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>
                  Scan QR CODE to verify E-pass
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
          <Typography
            variant="body2"
            sx={{ mt: 1, fontWeight: "bold", color: "#5F3B91" }}
          >
            This E-pass is valid for one-time entry only
          </Typography>
          <Grid
            container
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2, pr: 2 }}
          >
            <Grid item>
              <IconButton sx={{ color: "#5F3B91" }} onClick={downloadEPass}>
                <CloudDownloadIcon fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton sx={{ color: "#5F3B91" }} onClick={printEPass}>
                <PrintOutlinedIcon fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Card>
      </Container>
    </>
  );
};

export default VisitorCard;