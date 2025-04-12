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
import Footer from "../components/Footer";

const VisitorCardKiosk = () => {
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

  const getLastFourDigits = (id) => {
    const idStr = (id || "").toString();
    return idStr.slice(-4);
  };

  const formatTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString();
  };

  const downloadEPass = () => {
    html2canvas(visitorRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Visitor_E_Pass_${visitorId || "latest"}.png`;
      link.click();
    });
  };

  const printEPass = () => {
    if (!visitor) return;

    const qrCanvas = document.querySelector("canvas");
    if (!qrCanvas) {
      alert("QR Code not found!");
      return;
    }
    const qrDataUrl = qrCanvas.toDataURL("image/png");

    const preloadImage = (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url || "/default-avatar.png";
        img.onload = () => resolve(img.src);
        img.onerror = () => resolve("/default-avatar.png");
      });
    };

    preloadImage(visitor.photoUrl).then((photoUrl) => {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visitor Hall Ticket</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f0f0f0;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      margin: 0;
    }

    .hall-ticket {
      width: 450px;
      min-height: 350px;
      padding: 15px;
      box-sizing: border-box;
      background-color: #fff;
      border: 2px solid #5F3B91;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .header {
      background-color: #5F3B91;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 4px 4px 0 0;
      margin: -15px -15px 0 -15px;
      font-size: 18px;
    }

    .content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 10px;
    }

    .left-section {
      text-align: left;
      font-size: 14px;
      max-width: 55%;
    }

    .right-section {
      text-align: center;
    }

    img.photo {
      border-radius: 50%;
      border: 2px solid #D1C4E9;
      width: 70px;
      height: 70px;
    }

    .qr-code-container img {
      width: 80px;
      height: 80px;
      padding: 5px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
    }

    .qr-label {
      font-size: 12px;
      color: #333;
      font-weight: bold;
    }

    .signature-section {
      text-align: center;
      font-size: 12px;
      font-weight: bold;
      margin-top: 5px;
    }

    .signature-box {
      width: 150px;
      height: 30px;
      border: 1.5px solid #5F3B91;
      margin: 5px auto;
      text-align: center;
      line-height: 30px;
      font-style: italic;
      color: #999;
    }

    .footer {
      text-align: center;
      font-size: 12px;
      color: #5F3B91;
      font-weight: bold;
      border-top: 1.5px dashed #5F3B91;
      padding-top: 5px;
    }

    p {
      margin: 5px 0;
    }

    h3 {
      margin: 0;
      font-size: 16px;
    }

    h2 {
      margin: 0;
      font-size: 18px;
    }
  </style>
</head>

<body>
  <div class="hall-ticket">
    <div class="header">
      <h2>VISITOR HALL TICKET</h2>
    </div>
    <div class="content">
      <div class="left-section">
        <h3>${visitor.fullName}</h3>
        <p><strong>ID:</strong> ${visitor._id}</p>
        <p><strong>Check-In Time:</strong> ${new Date(visitor.checkInTime).toLocaleString()}</p>
        <p><strong>Purpose:</strong> ${visitor.reasonForVisit}</p>
        <p><strong>Designation:</strong> ${visitor.designation}</p>
        <p><strong>Company:</strong> ${visitor.visitorCompany}</p>
        <p><strong>Department:</strong> ${visitor.department}</p>
        <p><strong>Host:</strong> ${visitor.personToVisit}</p>
      </div>
      <div class="right-section">
        <img src="${photoUrl}" alt="Visitor Photo" class="photo" />
        <div class="qr-code-container">
          <img src="${qrDataUrl}" alt="QR Code" />
          <p class="qr-label">Scan to Verify</p>
        </div>
      </div>
    </div>
    <div class="signature-section">
      <p>Host Signature</p>
      <div class="signature-box">__________________</div>
    </div>
    <div class="footer">
      <p>This hall ticket is valid for one-time entry only</p>
    </div>
  </div>
</body>

</html>
      `);

      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
    }).catch((err) => {
      console.error("Error preloading image:", err);
      alert("Failed to load content for printing.");
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 12, flexGrow: 1 }}>
          <Typography variant="h6">Loading Visitor Details...</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 12, flexGrow: 1 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  if (!visitor) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Container maxWidth="md" sx={{ textAlign: "center", mt: 12, flexGrow: 1 }}>
          <Typography variant="h6">No Visitor Data Available</Typography>
        </Container>
        <Footer />
      </Box>
    );
  }

  const visitorIdStr = getLastFourDigits(visitor._id);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container 
        maxWidth="md" 
        sx={{ 
          textAlign: "center", 
          mt: 12, 
          mb: 4,
          flexGrow: 1 
        }}
      >
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
                src={visitor.photoUrl || "/default-avatar.png"}
                sx={{ width: 100, height: 100 }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  {visitor.fullName}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                  {formatTime(visitor.checkInTime || visitor.createdAt)}
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
              <Typography>Department: {visitor.department}</Typography>
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
                <Typography>Department: {visitor.department}</Typography>
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
      <Footer />
    </Box>
  );
};

export default VisitorCardKiosk;