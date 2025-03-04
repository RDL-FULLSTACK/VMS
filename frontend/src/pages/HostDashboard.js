import React from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useNavigate } from "react-router-dom";

const visitors = [
    { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting" },
    { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview" },
    { id: 3, name: "Michael Brown", company: "TechSoft", phone: "+1122334455", Time: "14:15", purpose: "Personal" }
];

const HostDashboard = () => {
    const navigate = useNavigate();

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", p: 3 }}>
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
                            <Grid item xs={2}><Typography fontWeight="bold">Time</Typography></Grid>
                            <Grid item xs={2}><Typography fontWeight="bold">Purpose</Typography></Grid>
                            <Grid item xs={2}><Typography fontWeight="bold">Action</Typography></Grid>
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
                                <Grid item xs={2}><Typography>{visitor.Time}</Typography></Grid>
                                <Grid item xs={2}><Typography>{visitor.purpose}</Typography></Grid>
                                <Grid item xs={2}>
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
    );
};

export default HostDashboard;
