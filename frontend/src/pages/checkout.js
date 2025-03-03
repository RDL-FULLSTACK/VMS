import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, TextField, MenuItem, Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import { CheckCircle, AccountCircle } from "@mui/icons-material";

const visitors = [
  { name: "John Doe", checkInTime: "10:30 AM", company: "ABC Corp", avatar: "" },
  { name: "Jane Smith", checkInTime: "11:00 AM", company: "XYZ Ltd", avatar: "" },
];

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
      navigate("/success"); // Navigate to success page
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 3, sm: 5 }, display: "flex", justifyContent: "center" }}>
      <Card sx={{ width: "100%", maxWidth: 500, p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            Visitor Check-Out
          </Typography>
          <TextField
            select
            fullWidth
            label="Full Name"
            onChange={handleVisitorChange}
            sx={{ mb: 2 }}
          >
            {visitors.map((visitor) => (
              <MenuItem key={visitor.name} value={visitor.name}>
                {visitor.name}
              </MenuItem>
            ))}
          </TextField>
          {selectedVisitor && (
            <Card
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                p: 2,
                boxShadow: 1,
                mb: 2,
              }}
            >
              <Avatar sx={{ width: { xs: 50, sm: 80 }, height: { xs: 50, sm: 80 }, mr: { xs: 0, sm: 2 }, mb: { xs: 2, sm: 0 } }}>
                {selectedVisitor.avatar || <AccountCircle fontSize="large" />}
              </Avatar>
              <Box textAlign={{ xs: "center", sm: "left" }}>
                <Typography><strong>Name:</strong> {selectedVisitor.name}</Typography>
                <Typography><strong>Time of Check-In:</strong> {selectedVisitor.checkInTime}</Typography>
                <Typography><strong>Company:</strong> {selectedVisitor.company}</Typography>
              </Box>
            </Card>
          )}
          <Button
            variant="contained"
            fullWidth
            sx={{ 
              mt: 2, 
              backgroundColor: "#3f51b5", 
              color: "#fff", 
              ":hover": { backgroundColor: "#303f9f" }, 
              fontSize: { xs: "0.8rem", sm: "1rem" } 
            }}
            disabled={!selectedVisitor}
            onClick={handleCheckout}
          >
            Check-Out
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};


// ✅ Success Page
const SuccessPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 10, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
      <CheckCircle sx={{ fontSize: 120, color: "green" }} />
      <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold" }}>
        Successful
      </Typography>
    </Container>
  );
};

// ✅ Main App Component (No Router Here)
const Checkout = () => {
  return (
    <Routes>
      <Route path="/" element={<VisitorCheckout />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  );
};

export default Checkout;
