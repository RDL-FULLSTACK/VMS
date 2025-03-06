import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button, TextField, useMediaQuery } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CheckCircle } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const visitorsData = [
    { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting" },
    { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview" }
];

const VisitorCheckout = () => {
    const navigate = useNavigate();
    const [visitors, setVisitors] = useState([]);
    const [otpInputs, setOtpInputs] = useState({});
    const isMobile = useMediaQuery("(max-width:600px)");

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("visitors")) || [];
        const today = new Date().toDateString();

        if (storedData.length > 0 && storedData[0].date === today) {
            setVisitors(storedData);
        } else {
            const updatedVisitors = visitorsData.map(visitor => ({
                ...visitor,
                otp: "",
                date: today,
            }));
            setVisitors(updatedVisitors);
            localStorage.setItem("visitors", JSON.stringify(updatedVisitors));
        }
    }, []);

    const handleOtpChange = (id, value) => {
        setOtpInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleCheckout = (id) => {
        const visitor = visitors.find(v => v.id === id);
        const enteredOtp = otpInputs[id];

        if (!enteredOtp) {
            toast.error("Please enter an OTP before checkout.", { position: "top-right", autoClose: 3000 });
            return;
        }

        if (enteredOtp === visitor.otp) {
            toast.success("OTP verified! Checking out...", { position: "top-right", autoClose: 2000 });
            setTimeout(() => navigate("/success"), 2000);
        } else {
            toast.error("Invalid OTP. Please enter the correct OTP.", { position: "top-right", autoClose: 3000 });
        }
    };

    return (
      <>
      
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
            <Box sx={{ flexGrow: 1, p: 2 }}>
                <Container>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>Visitor Checkout</Typography>

                    <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1, display: isMobile ? "none" : "block" }}>
                        <CardContent>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={2}><Typography fontWeight="bold">Name</Typography></Grid>
                                <Grid item xs={2}><Typography fontWeight="bold">Company</Typography></Grid>
                                <Grid item xs={2}><Typography fontWeight="bold">Phone</Typography></Grid>
                                <Grid item xs={1}><Typography fontWeight="bold">Time</Typography></Grid>
                                <Grid item xs={2}><Typography fontWeight="bold">Purpose</Typography></Grid>
                                <Grid item xs={1}><Typography fontWeight="bold">OTP</Typography></Grid>
                                <Grid item xs={2}><Typography fontWeight="bold">Actions</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {visitors.map((visitor) => (
                        <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} sm={2}><Typography><strong>Name:</strong> {visitor.name}</Typography></Grid>
                                    <Grid item xs={12} sm={2}><Typography><strong>Company:</strong> {visitor.company}</Typography></Grid>
                                    <Grid item xs={12} sm={2}><Typography><strong>Phone:</strong> {visitor.phone}</Typography></Grid>
                                    <Grid item xs={12} sm={1}><Typography><strong>Time:</strong> {visitor.Time}</Typography></Grid>
                                    <Grid item xs={12} sm={2}><Typography><strong>Purpose:</strong> {visitor.purpose}</Typography></Grid>
                                    <Grid item xs={12} sm={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={otpInputs[visitor.id] || ""}
                                            onChange={(e) => handleOtpChange(visitor.id, e.target.value)}
                                            placeholder="Enter OTP"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={2} sx={{ display: "flex", flexDirection: "row", gap: 1, justifyContent: "center" }}>
                                        <Button variant="contained" color="primary" size="small" onClick={() => handleCheckout(visitor.id)}>Checkout</Button>
                                        <IconButton onClick={() => navigate(`/update-status/${visitor.id}`)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Container>
            </Box>
            <ToastContainer />
        </Box>
    </>
    );
};

const SuccessPage = () => {
    return (
        <>
            <Navbar />
            <Container maxWidth="md" sx={{ mt: 5, textAlign: "center" }}>
                <CheckCircle sx={{ fontSize: 100, color: "#4CAF50" }} />
                <Typography variant="h4" sx={{ mt: 2, fontWeight: "bold", color: "#333" }}>Checkout Successful!</Typography>
            </Container>
        </>
    );
};

export { SuccessPage };

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