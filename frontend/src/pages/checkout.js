
// Checkout.js
import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Pagination,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate, Routes, Route } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from 'react-router-dom';

const VisitorCheckout = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [verifiedOtps, setVerifiedOtps] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowsPerPage = 7;

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/visitors");
        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }
        const rawData = await response.json();

        let data = Array.isArray(rawData) ? rawData : rawData.data || [];

        const transformedVisitors = data
          .filter((visitor) => !visitor.checkOutTime) // Only show visitors who haven't checked out
          .map((visitor) => {
            const checkInTime = visitor.checkInTime
              ? new Date(visitor.checkInTime)
              : null;
            const checkInDate = checkInTime
              ? checkInTime.toISOString().split("T")[0]
              : null;

            return {
              id: visitor._id,
              name: visitor.fullName || "",
              email: visitor.email || "",
              phone: visitor.phoneNumber || "",
              checkIn: checkInTime
                ? checkInTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "",
              purpose: visitor.reasonForVisit || "",
              host: visitor.personToVisit || "",
              company: visitor.visitorCompany || "",
              date: checkInDate,
              otp: visitor.otp || "N/A",
              checkInTimeRaw: checkInTime,
            };
          });

        setVisitors(transformedVisitors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
    const interval = setInterval(fetchVisitors, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (id, value) => {
    setOtpInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleVerifyOtp = (id) => {
    const visitor = visitors.find((v) => v.id === id);
    const enteredOtp = otpInputs[id];

    if (!visitor.otp || visitor.otp === "N/A") {
      toast.error("No OTP available for this visitor.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!enteredOtp) {
      toast.error("Please enter the OTP.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (enteredOtp === visitor.otp) {
      toast.success("OTP verified successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
      setVerifiedOtps((prev) => ({ ...prev, [id]: true }));
    } else {
      toast.error("Invalid OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      setVerifiedOtps((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleCheckout = async (id) => {
    const enteredOtp = otpInputs[id];

    if (!verifiedOtps[id]) {
      toast.error("Please verify the OTP first.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (!enteredOtp) {
      toast.error("Please enter the OTP.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const checkoutResponse = await fetch(
        `http://localhost:5000/api/visitors/checkout/${id}`,
        {
          method: "POST", // Changed from PUT to POST
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}), // Empty body as per backend requirement
        }
      );

      if (!checkoutResponse.ok) {
        const errorData = await checkoutResponse.json();
        throw new Error(errorData.message || "Failed to check out visitor");
      }

      const checkoutData = await checkoutResponse.json();

      toast.success("Checking out...", {
        position: "top-right",
        autoClose: 2000,
      });

      // Remove the checked-out visitor from the list
      setVisitors((prev) => prev.filter((v) => v.id !== id));
      setVerifiedOtps((prev) => {
        const newOtps = { ...prev };
        delete newOtps[id];
        return newOtps;
      });

      // Navigate to success page with checkoutId (optional)
      navigate("/success", { state: { checkoutId: checkoutData.data.checkoutId } });
    } catch (error) {
      toast.error(error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch =
      `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.company} ${visitor.purpose}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? visitor.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  const paginatedVisitors = filteredVisitors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const buttonStyles = {
    py: 0.3,
    fontSize: "0.75rem",
    minWidth: "80px",
    textAlign: "center",
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: "#f5f5f5", minHeight: "100vh" }}>
      <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 1 }}>
        <Typography variant="h6" gutterBottom>
          Visitor Checkout
        </Typography>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
            {error}
          </Typography>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Search Visitor"
                variant="outlined"
                fullWidth
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <TextField
                label="Filter by Date"
                type="date"
                variant="outlined"
                size="small"
                InputLabelProps={{ shrink: true }}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                sx={{ minWidth: { xs: "auto", sm: 150 } }}
              />
            </Box>

            <Box sx={{ overflowX: "auto" }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(8, minmax(100px, 1fr))",
                    sm: "40px 150px 200px 150px 100px 120px 150px 300px",
                  },
                  gap: 1,
                  bgcolor: "#e0e0e0",
                  p: 1,
                  borderRadius: 1,
                  fontWeight: "bold",
                  alignItems: "center",
                  minWidth: "1270px",
                }}
              >
                <Box>ID</Box>
                <Box>Name</Box>
                <Box>Email</Box>
                <Box>Phone</Box>
                <Box>Check In</Box>
                <Box>Host</Box>
                <Box>Company</Box>
                <Box textAlign="center">Actions</Box>
              </Box>

              {paginatedVisitors.map((visitor) => (
                <Box
                  key={visitor.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: {
                      xs: "repeat(8, minmax(100px, 1fr))",
                      sm: "40px 150px 200px 150px 100px 120px 150px 300px",
                    },
                    gap: 1,
                    p: 1,
                    borderBottom: "1px solid #e0e0e0",
                    alignItems: "center",
                    minWidth: "1270px",
                  }}
                >
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.id.slice(-4)}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.name}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.email}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.phone}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.checkIn}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.host}
                  </Box>
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {visitor.company}
                  </Box>
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        gap: 1,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TextField
                        size="small"
                        value={otpInputs[visitor.id] || ""}
                        onChange={(e) =>
                          handleOtpChange(visitor.id, e.target.value)
                        }
                        placeholder="Enter OTP"
                        sx={{ width: { xs: "150px", sm: "150px" } }}
                        inputProps={{ maxLength: 6 }}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          ...buttonStyles,
                          bgcolor: "blue",
                          color: "white",
                          "&:hover": { bgcolor: "darkblue" },
                        }}
                        onClick={() => handleVerifyOtp(visitor.id)}
                      >
                        Verify
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          ...buttonStyles,
                          bgcolor: "green",
                          color: "white",
                          "&:hover": { bgcolor: "darkgreen" },
                        }}
                        onClick={() => handleCheckout(visitor.id)}
                      >
                        Checkout
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(filteredVisitors.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
                size="small"
              />
            </Box>
          </>
        )}
      </Paper>
      <ToastContainer />
    </Box>
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Access checkoutId from navigation state
  const checkoutId = state?.checkoutId;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <CheckCircle sx={{ fontSize: 100, color: "#4CAF50" }} />
        <Typography
          variant="h4"
          sx={{ mt: 2, fontWeight: "bold", color: "#333" }}
        >
          Checkout Successful!
        </Typography>
        {checkoutId && (
          <Typography variant="body1" sx={{ mt: 1, color: "#666" }}>
            Checkout ID: {checkoutId.slice(0, 8)}...
          </Typography>
        )}
        <Typography variant="body1" sx={{ mt: 1, color: "#666" }}>
          Redirecting to dashboard in 2 seconds...
        </Typography>
      </Paper>
    </Box>
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