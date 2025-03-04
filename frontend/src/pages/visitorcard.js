import React, { useRef } from "react";
import { Typography, IconButton, Card, CardContent, Avatar, Grid, Container, Box } from "@mui/material";
import { QRCodeCanvas } from "qrcode.react";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import html2canvas from "html2canvas";

const VisitorCard = () => {
  const visitorRef = useRef(null);

  const visitor = {
    name: "Sunita Rao",
    id: "ae44e28",
    photo: "https://via.placeholder.com/100",
    date: "24 Feb, 2025",
    time: "12:51 PM (IST)",
    host: "John",
    designation: "HR",
    mobile: "9876543210",
    email: "john@gmail.com",
    purpose: "Business",
    visitorDesignation: "Manager",
    company: "BMW",
  };

  const downloadEPass = () => {
    html2canvas(visitorRef.current).then((canvas) => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "Visitor_E_Pass.png";
      link.click();
    });
  };

  const printEPass = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Visitor E-Pass</title>
        </head>
        <body>
          <div>
            <h2>VISITOR E-PASS</h2>
            <img src="${visitor.photo}" alt="Visitor Photo" width="100" height="100" />
            <h3>${visitor.name}</h3>
            <p><strong>ID:</strong> ${visitor.id}</p>
            <p><strong>Time:</strong> ${visitor.time}</p>
            <p><strong>Host:</strong> ${visitor.host}</p>
            <p><strong>Purpose:</strong> ${visitor.purpose}</p>
            <p><strong>Company:</strong> ${visitor.company}</p>
            <p><strong>Scan QR Code to Verify</strong></p>
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", mt: 12 }}>
      <Card ref={visitorRef} sx={{ maxWidth: 800, margin: "auto", p: 3, textAlign: "center", backgroundColor: "#EDE7F6", color: "#000", borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", backgroundColor: "#D1C4E9", padding: "10px", borderRadius: 1 }}>
          VISITOR E-PASS
        </Typography>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item textAlign="left" sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar src={visitor.photo} sx={{ width: 100, height: 100 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>{visitor.name}</Typography>
              <Typography variant="body2" sx={{ fontWeight: "bold" }}>{visitor.time}</Typography>
              <Typography variant="body2">ID: {visitor.id}</Typography>
            </Box>
          </Grid>
          <Grid item textAlign="left" sx={{ ml: 4 }}>
            <Typography sx={{ mt: 1 }}>Purpose: {visitor.purpose}</Typography>
            <Typography>Visitor Designation: {visitor.visitorDesignation}</Typography>
            <Typography>Company Name: {visitor.company}</Typography>
          </Grid>
        </Grid>
        <hr />
        <CardContent>
          <Grid container spacing={2} alignItems="center" justifyContent="space-between">
            <Grid item textAlign="left">
              <Typography>Host Name: {visitor.host}</Typography>
              <Typography>Host Designation: {visitor.designation}</Typography>
              <Typography>Mobile: {visitor.mobile}</Typography>
              <Typography>Email: {visitor.email}</Typography>
            </Grid>
            <Grid item>
              <QRCodeCanvas value={visitor.id} size={100} />
              <Typography variant="body2" sx={{ mt: 1, textAlign: "center" }}>Scan QR CODE to verify E-pass</Typography>
            </Grid>
          </Grid>
        </CardContent>
        <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold", color: "#5F3B91" }}>
          This E-pass is valid for one-time entry only
        </Typography>
        <Grid container spacing={2} justifyContent="flex-end" sx={{ mt: 2, pr: 2 }}>
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
  );
};

export default VisitorCard;