import React, { useState, useEffect } from "react";
import { 
  Box, Container, Grid, Card, CardContent, Typography, IconButton, 
  Button, Popover 
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

const HostVisitorFromCheckIn = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const visitorsPerPage = 10; // Number of visitors per page

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/visitors");
        console.log("Full API Response:", response);
        console.log("Response Data:", response.data);

        const visitorsArray = response.data.data || [];
        if (!Array.isArray(visitorsArray)) {
          throw new Error("Expected an array in response.data.data, but got: " + typeof visitorsArray);
        }

        const visitorsData = visitorsArray.map(visitor => ({
          id: visitor._id || "Unknown ID",
          name: visitor.fullName || visitor.name || "N/A",
          company: visitor.visitorCompany || "N/A",
          phone: visitor.phoneNumber || visitor.phone || "N/A",
          Time: visitor.checkInTime
            ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A",
          purpose: visitor.reasonForVisit || "N/A",
          otp: visitor.otp || generateOTP(),
          status: visitor.status || "Pending",
        }));

        console.log("Mapped Visitors:", visitorsData);
        setVisitors(visitorsData);
        setError(null);
      } catch (error) {
        console.error("Error fetching visitors:", error.message);
        setVisitors([]);
        setError(`Failed to fetch visitors: ${error.message}`);
      }
    };

    fetchVisitors();
  }, []);

  const regenerateOTP = (id) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
    );
    setVisitors(updatedVisitors);
  };

  const handleApproval = async (id) => {
    try {
      const updatedVisitors = visitors.map(visitor =>
        visitor.id === id ? { ...visitor, status: "Approved" } : visitor
      );
      setVisitors(updatedVisitors);
      await axios.put(`http://localhost:5000/api/visitors/${id}`, { status: "Approved" });
    } catch (error) {
      console.error("Error approving visitor:", error);
    }
  };

  const handleRejection = async (id) => {
    try {
      const updatedVisitors = visitors.map(visitor =>
        visitor.id === id ? { ...visitor, status: "Rejected" } : visitor
      );
      setVisitors(updatedVisitors);
      await axios.put(`http://localhost:5000/api/visitors/${id}`, { status: "Rejected" });
    } catch (error) {
      console.error("Error rejecting visitor:", error);
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  // Pagination Logic
  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
              Host Panel
            </Typography>
            <IconButton onClick={handleNotificationClick}>
              <NotificationsIcon sx={{ fontSize: 30, color: "#5F3B91" }} />
            </IconButton>
          </Box>

          {error && <Typography color="error" sx={{ mb: 2, textAlign: "center" }}>{error}</Typography>}

          <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
            <CardContent>
              <Grid container spacing={1} alignItems="center">
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

          {currentVisitors.length > 0 ? (
            currentVisitors.map((visitor) => (
              <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white" }}>
                <CardContent>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={2}><Typography>{visitor.name}</Typography></Grid>
                    <Grid item xs={2}><Typography>{visitor.company}</Typography></Grid>
                    <Grid item xs={2}><Typography>{visitor.phone}</Typography></Grid>
                    <Grid item xs={1}><Typography>{visitor.Time}</Typography></Grid>
                    <Grid item xs={2}><Typography>{visitor.purpose}</Typography></Grid>
                    <Grid item xs={1}>
                      <Typography sx={{ fontWeight: "bold", color: "#D32F2F" }}>{visitor.otp}</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Button variant="contained" color="primary" size="small" onClick={() => regenerateOTP(visitor.id)}>
                        Generate OTP
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", color: "gray" }}>No visitors found.</Typography>
          )}

          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button 
              variant="contained" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>

            <Typography sx={{ mx: 2, display: "flex", alignItems: "center" }}>
              Page {currentPage} of {Math.ceil(visitors.length / visitorsPerPage)}
            </Typography>

            <Button 
              variant="contained" 
              disabled={indexOfLastVisitor >= visitors.length} 
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default HostVisitorFromCheckIn;
