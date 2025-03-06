import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

const visitorsData = [
    { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting" },
    { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview" }
];

const HostDashboard = () => {
    const navigate = useNavigate();
    const [visitors, setVisitors] = useState([]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("visitors")) || [];
        const today = new Date().toDateString(); // Get today's date as a string

        if (storedData.length > 0 && storedData[0].date === today) {
            // ✅ Keep existing OTPs if they are from today
            setVisitors(storedData);
        } else {
            // 🔄 Generate new OTPs since it's a new day
            const updatedVisitors = visitorsData.map(visitor => ({
                ...visitor,
                otp: generateOTP(),
                date: today, // Store the current date
            }));

            setVisitors(updatedVisitors);
            localStorage.setItem("visitors", JSON.stringify(updatedVisitors));
        }
    }, []);

    const regenerateOTP = (id) => {
        const updatedVisitors = visitors.map(visitor =>
            visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
        );

        setVisitors(updatedVisitors);
        localStorage.setItem("visitors", JSON.stringify(updatedVisitors));
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <Box sx={{ flexGrow: 1, p: 3 }}>
                <Container>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
                        Host Panel
                    </Typography>

                    {/* Table Headers */}
                    <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
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

                    {/* Visitor List */}
                    {visitors.map((visitor) => (
                        <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
                            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={2}><Typography>{visitor.name}</Typography></Grid>
                                    <Grid item xs={2}><Typography>{visitor.company}</Typography></Grid>
                                    <Grid item xs={2}><Typography>{visitor.phone}</Typography></Grid>
                                    <Grid item xs={1}><Typography>{visitor.Time}</Typography></Grid>
                                    <Grid item xs={2}><Typography>{visitor.purpose}</Typography></Grid>
                                    <Grid item xs={1}><Typography sx={{ fontWeight: "bold", color: "#D32F2F" }}>{visitor.otp}</Typography></Grid>
                                    <Grid item xs={2}>
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            size="small"
                                            onClick={() => regenerateOTP(visitor.id)}
                                        >
                                            Generate OTP
                                        </Button>
                                        <IconButton onClick={() => navigate(`/update-status/${visitor.id}`)} sx={{ ml: 1 }}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Container>
            </Box>
        </Box>
    );
};

export default HostDashboard;
