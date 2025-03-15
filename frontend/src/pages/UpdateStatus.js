import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Box, Container, MenuItem, TextField, Button, Typography, 
    Card, CardContent 
} from "@mui/material";
import Swal from "sweetalert2";
import Navbar from "../components/Navbar"; // Added Navbar import
import Footer from "../components/Footer";

const UpdateStatus = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState(""); // Default empty state
    const [description, setDescription] = useState("");

    const handleSubmit = () => {
        console.log(`Visitor ${id} status:`, { status, description });

        // Show SweetAlert success message
        Swal.fire({
            title: "Status Updated!",
            text: `Visitor ${id} status updated to "${status}".`,
            icon: "success",
            confirmButtonText: "Close",
            confirmButtonColor: "#3b82f6",
        }).then(() => {
            navigate("/HostDashboard"); // ✅ Redirect to HostDashboard
        });
    };

    return (
        <Box sx={{ 
            minHeight: "100vh", 
            bgcolor: "#f5f5f5", 
            display: "flex", 
            flexDirection: "column" // Changed to column for vertical stacking
        }}>
            {/* Added Navbar */}
            <Navbar />
            
            <Box sx={{ 
                flexGrow: 1, // Added to make content take remaining space
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
            }}>
                <Container maxWidth="sm">
                    <Card sx={{ p: 2, boxShadow: 3, borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h5" sx={{ mb: 2, textAlign: "center", fontWeight: "bold" }}>
                                Update Visitor Status
                            </Typography>

                            {/* Status Dropdown */}
                            <TextField
                                select
                                fullWidth
                                variant="outlined"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                sx={{ mt: 2, bgcolor: "white" }}
                                label="Select Status"
                            >
                                <MenuItem value="">Select</MenuItem> {/* Default option */}
                                <MenuItem value="Available">Available</MenuItem>
                                <MenuItem value="Postpone">Postpone</MenuItem>
                                <MenuItem value="Cancel">Cancel</MenuItem>
                            </TextField>

                            {/* Description Field */}
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={3}
                                variant="outlined"
                                sx={{ mt: 2, bgcolor: "white" }}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />

                            {/* Submit Button */}
                            <Button
                                variant="contained"
                                sx={{ mt: 3, bgcolor: "#3b82f6", width: "100%", fontSize: "16px" }}
                                onClick={handleSubmit}
                                disabled={!status} // Disable button if status is not selected
                            >
                                Submit
                            </Button>
                        </CardContent>
                    </Card>
                </Container>
            </Box>
            <Footer/>
        </Box>
    );
};

export default UpdateStatus;