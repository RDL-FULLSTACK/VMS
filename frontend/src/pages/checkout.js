import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Container, TextField, MenuItem, Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import { CheckCircle, AccountCircle } from "@mui/icons-material";
import Navbar from "../components/Navbar";

const VisitorCheckout = () => {
    const [visitors, setVisitors] = useState([]);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [verificationCode, setVerificationCode] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // 🔄 Fetch visitors with their OTPs from localStorage
        const storedVisitors = JSON.parse(localStorage.getItem("visitors")) || [];
        setVisitors(storedVisitors);
    }, []);

    const handleVisitorChange = (event) => {
        const visitor = visitors.find((v) => v.name === event.target.value);
        setSelectedVisitor(visitor);
        setVerificationCode("");
        setError("");
    };

    const handleCheckout = () => {
        if (selectedVisitor && verificationCode === selectedVisitor.otp) {
            // ✅ Remove the checked-out visitor from localStorage
            const updatedVisitors = visitors.filter((v) => v.id !== selectedVisitor.id);
            setVisitors(updatedVisitors);
            localStorage.setItem("visitors", JSON.stringify(updatedVisitors));

            navigate("/success"); // Navigate to Success Page
        } else {
            setError("Invalid code. Please enter the correct code provided by the host.");
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
            <Card sx={{ width: "100%", maxWidth: 500, p: 3, boxShadow: 3 }}>
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
                            <MenuItem key={visitor.id} value={visitor.name}>
                                {visitor.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    {selectedVisitor && (
                        <>
                            <Card sx={{ display: "flex", alignItems: "center", p: 2, mb: 2 }}>
                                <Avatar sx={{ width: 80, height: 80, mr: 2 }}>
                                    {selectedVisitor.avatar || <AccountCircle fontSize="large" />}
                                </Avatar>
                                <Box>
                                    <Typography><strong>Name:</strong> {selectedVisitor.name}</Typography>
                                    <Typography><strong>Company:</strong> {selectedVisitor.company}</Typography>
                                    <Typography><strong>Time of Check-In:</strong> {selectedVisitor.Time}</Typography>
                                   
                                </Box>
                            </Card>
                            <TextField
                                fullWidth
                                label="Enter Verification Code"
                                type="password"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                sx={{ mb: 2 }}
                                error={!!error}
                                helperText={error}
                            />
                        </>
                    )}
                    <Button
                        variant="contained"
                        fullWidth
                        disabled={!selectedVisitor || verificationCode === ""}
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
        <Container maxWidth="md" sx={{ mt: 5, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", textAlign: "center" }}>
            <CheckCircle sx={{ fontSize: 100, color: "#4CAF50" }} />
            <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>
                Check-Out Successful!
            </Typography>
        </Container>
    );
};

export { SuccessPage };

// ✅ Main Checkout Component with Routing
const Checkout = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<VisitorCheckout />} />
                <Route path="/success" element={<SuccessPage />} />
            </Routes>
        </>
    );
};

export default Checkout;
