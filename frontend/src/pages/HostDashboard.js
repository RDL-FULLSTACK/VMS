import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button, Popover } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Switch } from "@mui/material";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const HostDashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [toggleVisitor, setToggleVisitor] = useState(() => {
    return JSON.parse(localStorage.getItem("toggleVisitor")) || false;
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const visitorsPerPage = 10; // Number of visitors per page

  useEffect(() => {
    const fetchPreSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/preschedules");
        console.log("Fetched pre-schedules from MongoDB:", response.data);

        const preSchedules = response.data.map(pre => ({
          id: pre._id,
          name: pre.name || "Unknown",
          date: pre.date || "N/A",
          Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          purpose: pre.purpose || "N/A",
          host: pre.host || "N/A",
          email: pre.email || "N/A",
          status: pre.status || "Pending",
          otp: generateOTP(),
        }));

        setVisitors(preSchedules);
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

  useEffect(() => {
    localStorage.setItem("toggleVisitor", JSON.stringify(toggleVisitor));
  }, [toggleVisitor]);

  const regenerateOTP = (id) => {
    const updatedVisitors = visitors.map(visitor =>
      visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
    );
    setVisitors(updatedVisitors);
  };

  const handleApproval = async (id) => {
    try {
      const visitor = visitors.find(v => v.id === id);
      if (!visitor) throw new Error("Visitor not found");

      const updatedVisitors = visitors.map(v =>
        v.id === id ? { ...v, status: "Approved" } : v
      );
      setVisitors(updatedVisitors);
      console.log("Approving ID:", id);

      const response = await axios.put(`http://localhost:5000/api/preschedules/${id}/approve`);
      console.log("Approval response:", response.data);
      toast.success(`Approved ${visitor.name} for ${visitor.purpose}. Email sent to ${visitor.email}`);

      const refreshedResponse = await axios.get("http://localhost:5000/api/preschedules");
      setVisitors(refreshedResponse.data.map(pre => ({
        id: pre._id,
        name: pre.name || "Unknown",
        date: pre.date || "N/A",
        Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        purpose: pre.purpose || "N/A",
        host: pre.host || "N/A",
        email: pre.email || "N/A",
        status: pre.status || "Pending",
        otp: generateOTP(),
      })));
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
      const visitor = visitors.find(v => v.id === id);
      if (!visitor) throw new Error("Visitor not found");

      const updatedVisitors = visitors.map(v =>
        v.id === id ? { ...v, status: "Rejected" } : v
      );
      setVisitors(updatedVisitors);
      console.log("Rejecting ID:", id);

      const response = await axios.put(`http://localhost:5000/api/preschedules/${id}/reject`);
      console.log("Rejection response:", response.data);
      toast.success(`Rejected ${visitor.name} for ${visitor.purpose}. Email sent to ${visitor.email}!`);

      const refreshedResponse = await axios.get("http://localhost:5000/api/preschedules");
      setVisitors(refreshedResponse.data.map(pre => ({
        id: pre._id,
        name: pre.name || "Unknown",
        date: pre.date || "N/A",
        Time: pre.Time || new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        purpose: pre.purpose || "N/A",
        host: pre.host || "N/A",
        email: pre.email || "N/A",
        status: pre.status || "Pending",
        otp: generateOTP(),
      })));
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

  const handleToggleChange = () => {
    setToggleVisitor(true);
    navigate("/HostVisitorFormCheckIn");
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
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: "bold", textAlign: "center", fontSize: { xs: "1.5rem", sm: "1.75rem" } }}
            >
              Host Panel
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton onClick={handleNotificationClick}>
                <NotificationsIcon sx={{ fontSize: 30, color: "#5F3B91" }} />
                {visitors.filter(v => v.status === "Pending").length > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      top: 5,
                      right: 5,
                      bgcolor: "red",
                      borderRadius: "50%",
                      width: 15,
                      height: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    {visitors.filter(v => v.status === "Pending").length}
                  </Box>
                )}
              </IconButton>

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

          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <Box sx={{ p: 2, maxWidth: 400 }}>
              <Typography variant="h6">Notifications</Typography>
              {visitors.filter(v => v.status === "Pending").length > 0 ? (
                visitors
                  .filter(v => v.status === "Pending")
                  .map(visitor => (
                    <Box key={visitor.id} sx={{ mb: 2, borderBottom: "1px solid #eee" }}>
                      <Typography variant="body2">
                        <strong>{visitor.name}</strong> scheduled a visit for <strong>{visitor.purpose}</strong> on{" "}
                        {visitor.date}.
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => handleApproval(visitor.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleRejection(visitor.id)}
                        >
                          Reject
                        </Button>
                      </Box>
                    </Box>
                  ))
              ) : (
                <Typography variant="body2">No pending pre-schedules</Typography>
              )}
            </Box>
          </Popover>

          <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
            <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
              <Grid
                container
                spacing={1}
                alignItems="center"
                sx={{ display: { xs: "none", sm: "flex" } }}
              >
                <Grid item xs={2}><Typography fontWeight="bold">Name</Typography></Grid>
                <Grid item xs={2}><Typography fontWeight="bold">Date</Typography></Grid>
                <Grid item xs={1}><Typography fontWeight="bold">Time</Typography></Grid>
                <Grid item xs={2}><Typography fontWeight="bold">Purpose</Typography></Grid>
                <Grid item xs={1}><Typography fontWeight="bold">OTP</Typography></Grid>
                <Grid item xs={2}><Typography fontWeight="bold">Status</Typography></Grid>
                <Grid item xs={2}><Typography fontWeight="bold">Actions</Typography></Grid>
              </Grid>
            </CardContent>
          </Card>

          {currentVisitors.length > 0 ? (
            currentVisitors.map((visitor) => (
              <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
                <CardContent
                  sx={{
                    p: { xs: 1, sm: 2 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Grid container spacing={1} alignItems="center">
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                        {visitor.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                        {visitor.date}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                        {visitor.Time}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                        {visitor.purpose}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography
                        sx={{ fontWeight: "bold", color: "#D32F2F", fontSize: { xs: "1.1rem", sm: "1rem" } }}
                      >
                        {visitor.otp}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                        {visitor.status}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: { xs: "row", sm: "row" },
                          gap: 1,
                          justifyContent: { xs: "flex-start", sm: "flex-end" },
                        }}
                      >
                        {visitor.status === "Pending" && (
                          <></>
                        )}
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => regenerateOTP(visitor.id)}
                          sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, py: 0.5 }}
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
            <Typography variant="body1" sx={{ textAlign: "center", mt: 2 }}>
              No pre-schedule data available.
            </Typography>
          )}

          {/* Pagination Controls */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              sx={{ mr: 2 }}
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

export default HostDashboard;