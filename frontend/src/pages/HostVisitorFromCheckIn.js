import React, { useState, useEffect } from "react";
import { 
  Box, Container, Grid, Card, CardContent, Typography, Button 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { Switch } from "@mui/material";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const HostVisitorFromCheckIn = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const visitorsPerPage = 10;
  const [toggleVisitor, setToggleVisitor] = useState(() => {
    return JSON.parse(localStorage.getItem("toggleVisitor")) || false;
  });

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

  useEffect(() => {
    localStorage.setItem("toggleVisitor", JSON.stringify(toggleVisitor));
  }, [toggleVisitor]);

  const regenerateOTP = (id) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
    );
    setVisitors(updatedVisitors);
  };

  const handleToggleChange = () => {
    setToggleVisitor(false);
    navigate("/HostDashboard");
  };

  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              justifyContent: "space-between", 
              alignItems: { xs: "flex-start", sm: "center" }, 
              mb: 3 
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: "bold", 
                textAlign: { xs: "left", sm: "center" }, 
                fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                mb: { xs: 2, sm: 0 }
              }}
            >
              Visitors
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                justifyContent: "flex-end",
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Switch
                checked={toggleVisitor}
                onChange={handleToggleChange}
                sx={{
                  "& .MuiSwitch-switchBase.Mui-checked": {
                    color: "#5F3B91",
                  },
                  "& .MuiSwitch-track": {
                    bgcolor: toggleVisitor ? "#5F3B91" : "lightgray",
                  },
                }}
              />
            </Box>
          </Box>

          {error && (
            <Typography 
              color="error" 
              sx={{ 
                mb: 2, 
                textAlign: "center", 
                fontSize: { xs: "0.9rem", sm: "1rem" } 
              }}
            >
              {error}
            </Typography>
          )}
        
          <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: { xs: 0.5, sm: 1 } }}>
            <CardContent>
              <Grid 
                container 
                spacing={1} 
                alignItems="center" 
                sx={{ display: { xs: "none", sm: "flex" } }}
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

          {currentVisitors.length > 0 ? (
            currentVisitors.map((visitor) => (
              <Card 
                key={visitor.id} 
                sx={{ 
                  mb: 2, 
                  bgcolor: "white", 
                  overflow: "hidden" 
                }}
              >
                <CardContent 
                  sx={{ 
                    p: { xs: 1, sm: 2 }, 
                    display: "flex", 
                    flexDirection: { xs: "column", sm: "row" }, 
                    gap: { xs: 1, sm: 0 } 
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography 
                        sx={{ 
                          fontSize: { xs: "0.9rem", sm: "1rem" }, 
                          fontWeight: { xs: "bold", sm: "normal" } 
                        }}
                      >
                        {visitor.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                        {visitor.company}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                        {visitor.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                        {visitor.Time}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
                        {visitor.purpose}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography 
                        sx={{ 
                          fontWeight: "bold", 
                          color: "#D32F2F", 
                          fontSize: { xs: "1rem", sm: "1.1rem" } 
                        }}
                      >
                        {visitor.otp}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box 
                        sx={{ 
                          display: "flex", 
                          justifyContent: { xs: "flex-start", sm: "flex-end" }, 
                          flexWrap: "wrap", 
                          gap: 1 
                        }}
                      >
                        <Button 
                          variant="contained" 
                          color="primary" 
                          size="small" 
                          onClick={() => regenerateOTP(visitor.id)}
                          sx={{ 
                            fontSize: { xs: "0.7rem", sm: "0.875rem" }, 
                            py: 0.5, 
                            px: { xs: 1, sm: 2 } 
                          }}
                        >
                          Generate OTP
                        </Button>
                    
                      
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography 
              sx={{ 
                textAlign: "center", 
                color: "gray", 
                fontSize: { xs: "0.9rem", sm: "1rem" }, 
                mt: 2 
              }}
            >
              No visitors found.
            </Typography>
          )}

          <Box 
            sx={{ 
              display: "flex", 
              flexDirection: { xs: "column", sm: "row" }, 
              justifyContent: "center", 
              alignItems: "center", 
              mt: 2, 
              gap: { xs: 1, sm: 2 } 
            }}
          >
            <Button 
              variant="contained" 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ 
                fontSize: { xs: "0.8rem", sm: "0.875rem" }, 
                minWidth: { xs: "100px", sm: "120px" } 
              }}
            >
              Previous
            </Button>

            <Typography 
              sx={{ 
                mx: { xs: 0, sm: 2 }, 
                fontSize: { xs: "0.9rem", sm: "1rem" }, 
                textAlign: "center" 
              }}
            >
              Page {currentPage} of {Math.ceil(visitors.length / visitorsPerPage)}
            </Typography>

            <Button 
              variant="contained" 
              disabled={indexOfLastVisitor >= visitors.length} 
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{ 
                fontSize: { xs: "0.8rem", sm: "0.875rem" }, 
                minWidth: { xs: "100px", sm: "120px" } 
              }}
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