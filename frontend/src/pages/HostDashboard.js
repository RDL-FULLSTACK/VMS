import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  Popover,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";

const HostDashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [viewMode, setViewMode] = useState("Pre-Schedules");
  const [currentPage, setCurrentPage] = useState(1);
  const visitorsPerPage = 10;

  useEffect(() => {
    const fetchPreSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/preschedules");
        console.log("Fetched pre-schedules from MongoDB:", response.data);

        const preSchedules = response.data.map((pre) => ({
          id: pre._id,
          name: pre.name || "Unknown",
          date: pre.date || "N/A",
          Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          purpose: pre.purpose || "N/A",
          host: pre.host || "N/A",
          email: pre.email || "N/A",
          status: pre.status || "Pending",
        }));

        const sortedPreSchedules = preSchedules.sort((a, b) => {
          return b.id.localeCompare(a.id);
        });

        setVisitors(sortedPreSchedules);
      } catch (error) {
        console.error("Error fetching pre-schedules:", {
          message: error.message,
          response: error.response ? error.response.data : null,
        });
        toast.error("Failed to fetch pre-schedule data.");
        setVisitors([]);
      }
    };
    fetchPreSchedules();
  }, []);

  const handleApproval = async (id) => {
    try {
      const visitor = visitors.find((v) => v.id === id);
      if (!visitor) throw new Error("Visitor not found");

      const updatedVisitors = visitors.map((v) =>
        v.id === id ? { ...v, status: "Approved" } : v
      );
      setVisitors(updatedVisitors);
      console.log("Approving ID:", id);

      const response = await axios.put(`http://localhost:5000/api/preschedules/${id}/approve`);
      console.log("Approval response:", response.data);
      toast.success(`Approved ${visitor.name} for ${visitor.purpose}. Email sent to ${visitor.email}`);

      const refreshedResponse = await axios.get("http://localhost:5000/api/preschedules");
      const refreshedPreSchedules = refreshedResponse.data.map((pre) => ({
        id: pre._id,
        name: pre.name || "Unknown",
        date: pre.date || "N/A",
        Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        purpose: pre.purpose || "N/A",
        host: pre.host || "N/A",
        email: pre.email || "N/A",
        status: pre.status || "Pending",
      }));

      const sortedRefreshedPreSchedules = refreshedPreSchedules.sort((a, b) => {
        return b.id.localeCompare(a.id);
      });

      setVisitors(sortedRefreshedPreSchedules);
    } catch (error) {
      console.error("Error approving:", {
        message: error.message,
        response: error.response ? error.response.data : null,
      });
      toast.error(error.response?.data?.message || "Failed to approve visitor or send email.");
    }
  };

  const handleRejection = async (id) => {
    try {
      const visitor = visitors.find((v) => v.id === id);
      if (!visitor) throw new Error("Visitor not found");

      const updatedVisitors = visitors.map((v) =>
        v.id === id ? { ...v, status: "Rejected" } : v
      );
      setVisitors(updatedVisitors);
      console.log("Rejecting ID:", id);

      const response = await axios.put(`http://localhost:5000/api/preschedules/${id}/reject`);
      console.log("Rejection response:", response.data);
      toast.success(`Rejected ${visitor.name} for ${visitor.purpose}. Email sent to ${visitor.email}!`);

      const refreshedResponse = await axios.get("http://localhost:5000/api/preschedules");
      const refreshedPreSchedules = refreshedResponse.data.map((pre) => ({
        id: pre._id,
        name: pre.name || "Unknown",
        date: pre.date || "N/A",
        Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        purpose: pre.purpose || "N/A",
        host: pre.host || "N/A",
        email: pre.email || "N/A",
        status: pre.status || "Pending",
      }));

      const sortedRefreshedPreSchedules = refreshedPreSchedules.sort((a, b) => {
        return b.id.localeCompare(a.id);
      });

      setVisitors(sortedRefreshedPreSchedules);
    } catch (error) {
      console.error("Error rejecting:", {
        message: error.message,
        response: error.response ? error.response.data : null,
      });
      toast.error(error.response?.data?.message || "Failed to reject visitor or send email.");
    }
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
    if (newView === "Visitors") {
      navigate("/HostVisitorFormCheckIn");
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const indexOfLastVisitor = currentPage * visitorsPerPage;
  const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
  const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: { xs: "left", sm: "center" },
                fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
              }}
            >
              Pre-Schedules
            </Typography>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  bgcolor: "#e0e0e0",
                  borderRadius: "20px",
                  p: 0.5,
                }}
              >
                <Button
                  onClick={() => handleViewChange("Pre-Schedules")}
                  sx={{
                    bgcolor: viewMode === "Pre-Schedules" ? "#5F3B91" : "transparent",
                    color: viewMode === "Pre-Schedules" ? "white" : "black",
                    borderRadius: "20px",
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.3, sm: 0.5 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: viewMode === "Pre-Schedules" ? "#4a2c73" : "#d0d0d0",
                    },
                  }}
                >
                  Approvals
                </Button>
                <Button
                  onClick={() => handleViewChange("Visitors")}
                  sx={{
                    bgcolor: viewMode === "Visitors" ? "#5F3B91" : "transparent",
                    color: viewMode === "Visitors" ? "white" : "black",
                    borderRadius: "20px",
                    px: { xs: 1.5, sm: 2 },
                    py: { xs: 0.3, sm: 0.5 },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: viewMode === "Visitors" ? "#4a2c73" : "#d0d0d0",
                    },
                  }}
                >
                  Visitors
                </Button>
              </Box>

              <IconButton onClick={handleNotificationClick}>
                <NotificationsIcon sx={{ fontSize: { xs: 24, sm: 30 }, color: "#5F3B91" }} />
                {visitors.filter((v) => v.status === "Pending").length > 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 5,
                      right: 5,
                      bgcolor: "red",
                      borderRadius: "50%",
                      width: { xs: 12, sm: 15 },
                      height: { xs: 12, sm: 15 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: { xs: "8px", sm: "10px" },
                    }}
                  >
                    {visitors.filter((v) => v.status === "Pending").length}
                  </Box>
                )}
              </IconButton>
            </Box>
          </Box>

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ p: 2, maxWidth: { xs: 300, sm: 400 } }}>
              <Typography variant="h6" sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}>
                Notifications
              </Typography>
              {visitors.filter((v) => v.status === "Pending").length > 0 ? (
                visitors
                  .filter((v) => v.status === "Pending")
                  .map((visitor) => (
                    <Box key={visitor.id} sx={{ mb: 2, borderBottom: "1px solid #eee" }}>
                      <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        <strong>{visitor.name}</strong> scheduled a visit for{" "}
                        <strong>{visitor.purpose}</strong> on {visitor.date}.
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApproval(visitor.id)}
                          sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" }, px: { xs: 1, sm: 2 } }}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRejection(visitor.id)}
                          sx={{ fontSize: { xs: "0.65rem", sm: "0.75rem" }, px: { xs: 1, sm: 2 } }}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  ))
              ) : (
                <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                  No pending pre-schedules
                </Typography>
              )}
            </Box>
          </Popover>

          <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white" }}>
            <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={12} sm={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Date
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Time
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Purpose
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Status
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {currentVisitors.length > 0 ? (
            currentVisitors.map((visitor) => (
              <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
                <CardContent sx={{ p: { xs: 1, sm: 2 } }}>
                  <Grid container spacing={1} alignItems="left" direction={{ xs: "column", sm: "row" }}>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        <strong>{visitor.name}</strong>
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.date}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.Time}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.purpose}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{ textAlign: "center", mt: 2, fontSize: { xs: "0.875rem", sm: "1rem" } }}
            >
              No pre-schedule data available.
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "center",
              alignItems: "center",
              mt: 2,
              gap: { xs: 1, sm: 2 },
            }}
          >
            <Button
              variant="contained"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: { xs: "100px", sm: "120px" },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              Previous
            </Button>
            <Typography
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                display: "flex",
                alignItems: "center",
              }}
            >
              Page {currentPage} of {Math.ceil(visitors.length / visitorsPerPage)}
            </Typography>
            <Button
              variant="contained"
              disabled={indexOfLastVisitor >= visitors.length}
              onClick={() => setCurrentPage(currentPage + 1)}
              sx={{
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                minWidth: { xs: "100px", sm: "120px" },
                py: { xs: 0.5, sm: 1 },
              }}
            >
              Next
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer/>
    </Box>
  );
};

export default HostDashboard;