import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, TextField, MenuItem, Card, CardContent, Typography, Button, Avatar, AppBar, Toolbar, Box } from "@mui/material";
import { CheckCircle, AccountCircle } from "@mui/icons-material";
import Home from "../pages/Home";

// ✅ Visitor List
const visitors = [
  { name: "John Doe", checkInTime: "10:30 AM", company: "ABC Corp", avatar: "" },
  { name: "Jane Smith", checkInTime: "11:00 AM", company: "XYZ Ltd", avatar: "" },
];

// ✅ Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <AppBar position="static" sx={{ backgroundColor: "#5F3B91", boxShadow: "none" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>Visitor Management System</Typography>
        <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Typography variant="body1" sx={{ cursor: "pointer", ":hover": { color: "#ccc" } }} onClick={() => navigate("/")}>
            Dashboard
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer", ":hover": { color: "#ccc" } }} onClick={() => navigate("/check-in")}>
            Check-In
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer", ":hover": { color: "#ccc" } }} onClick={() => navigate("/pre-scheduling")}>
            Pre-Scheduling
          </Typography>
          <Typography variant="body1" sx={{ cursor: "pointer", ":hover": { color: "#ccc" } }} onClick={() => navigate("/")}>
            Check-Out
          </Typography>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", ":hover": { color: "#ccc" } }}
            onClick={() => navigate("/receptionist")}
          >
            <AccountCircle fontSize="small" /> Receptionist
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// ✅ Visitor Check-Out Page
const VisitorCheckout = () => {
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const navigate = useNavigate();

  const handleVisitorChange = (event) => {
    const visitor = visitors.find((v) => v.name === event.target.value);
    setSelectedVisitor(visitor);
  };

  const handleCheckout = () => {
    if (selectedVisitor) {
      navigate("/success");
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Card sx={{ width: "60%", p: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h5" textAlign="center" gutterBottom>Visitor Check-Out</Typography>
            <TextField select fullWidth label="Full Name" onChange={handleVisitorChange} sx={{ mb: 2 }}>
              {visitors.map((visitor) => (
                <MenuItem key={visitor.name} value={visitor.name}>{visitor.name}</MenuItem>
              ))}
            </TextField>
            {selectedVisitor && (
              <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 1, mb: 2 }}>
                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                  {selectedVisitor.avatar || <AccountCircle fontSize="large" />}
                </Avatar>
                <Box>
                  <Typography><strong>Name:</strong> {selectedVisitor.name}</Typography>
                  <Typography><strong>Time of Check-In:</strong> {selectedVisitor.checkInTime}</Typography>
                  <Typography><strong>Company:</strong> {selectedVisitor.company}</Typography>
                </Box>
              </Card>
            )}
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#3f51b5", color: "#fff", ":hover": { backgroundColor: "#303f9f" } }}
              disabled={!selectedVisitor}
              onClick={handleCheckout}
            >
              Check-Out
            </Button>
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

// ✅ Success Page
const SuccessPage = () => {
  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 10, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <CheckCircle sx={{ fontSize: 120, color: "green" }} />
        <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>Successful</Typography>
      </Container>
    </>
  );
};

// ✅ Placeholder Pages
const Dashboard = () => <h2>Dashboard Page</h2>;
const CheckIn = () => <h2>Check-In Page</h2>;
const PreScheduling = () => <h2>Pre-Scheduling Page</h2>;
const Receptionist = () => <h2>Receptionist Page</h2>;

// ✅ Fix: Remove Extra `<Router>`
const Checkout = () => {
  return (
    <Routes>
      <Route path="/" element={<VisitorCheckout />} />
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/check-in" element={<CheckIn />} />
      <Route path="/pre-scheduling" element={<PreScheduling />} />
      <Route path="/receptionist" element={<Receptionist />} />
    </Routes>
  );
};

export default Checkout;
