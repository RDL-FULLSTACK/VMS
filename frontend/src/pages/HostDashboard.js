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
            <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
                <Container>
                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mb: 3, 
                            fontWeight: "bold", 
                            textAlign: "center",
                            fontSize: { xs: '1.5rem', sm: '1.75rem' } // Smaller on mobile
                        }}
                    >
                        Host Panel
                    </Typography>

                    {/* Table Headers */}
                    <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
                        <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
                            <Grid 
                                container 
                                spacing={1} 
                                alignItems="center" 
                                sx={{ 
                                    display: { xs: 'none', sm: 'flex' } // Hide headers on mobile, show on larger screens
                                }}
                            >
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
                            <CardContent 
                                sx={{ 
                                    p: { xs: 1, sm: 2 },
                                    display: 'flex', 
                                    flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
                                    alignItems: { xs: 'flex-start', sm: 'center' },
                                    gap: { xs: 1, sm: 0 }
                                }}
                            >
                                <Grid container spacing={1} alignItems="center">
                                    <Grid item xs={12} sm={2}>
                                        <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
                                            {visitor.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
                                            {visitor.company}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
                                            {visitor.phone}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
                                            {visitor.Time}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
                                            {visitor.purpose}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={1}>
                                        <Typography 
                                            sx={{ 
                                                fontWeight: "bold", 
                                                color: "#D32F2F",
                                                fontSize: { xs: '1.1rem', sm: '1rem' } // Larger OTP on mobile
                                            }}
                                        >
                                            {visitor.otp}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={2}>
                                        <Box 
                                            sx={{ 
                                                display: 'flex', 
                                                flexDirection: { xs: 'row', sm: 'row' }, 
                                                gap: 1,
                                                justifyContent: { xs: 'flex-start', sm: 'flex-end' }
                                            }}
                                        >
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                size="small"
                                                onClick={() => regenerateOTP(visitor.id)}
                                                sx={{ 
                                                    fontSize: { xs: '0.7rem', sm: '0.875rem' }, 
                                                    py: 0.5 
                                                }}
                                            >
                                                Generate OTP
                                            </Button>
                                            {/* Uncomment if needed */}
                                            {/* <IconButton 
                                                onClick={() => navigate(`/update-status/${visitor.id}`)} 
                                                sx={{ p: 0.5 }}
                                            >
                                                <MoreVertIcon />
                                            </IconButton> */}
                                        </Box>
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