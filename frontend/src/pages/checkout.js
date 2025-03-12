import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import { useNavigate, Routes, Route } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VisitorCheckout = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [otpInputs, setOtpInputs] = useState({});
  const [generatedOtps, setGeneratedOtps] = useState({});
  const [selectedVisitor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
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
          .filter((visitor) => !visitor.checkOutTime)
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
              assets: visitor.assets || [],
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
    const interval = setInterval(fetchVisitors, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (id, value) => {
    setOtpInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleGenerateOtp = async (visitor) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/visitors/send-email-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: visitor.email }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate OTP");
      }

      toast.success(`OTP sent to ${visitor.email}`, {
        position: "top-right",
        autoClose: 3000,
      });
      setGeneratedOtps((prev) => ({ ...prev, [visitor.id]: true }));
    } catch (error) {
      toast.error("Failed to generate OTP: " + error.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleCheckout = async (id) => {
    const visitor = visitors.find((v) => v.id === id);
    const enteredOtp = otpInputs[id];

    if (!generatedOtps[id]) {
      toast.error("Please generate an OTP first.", {
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
      const verifyResponse = await fetch(
        "http://localhost:5000/api/visitors/verify-email-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: visitor.email, otp: enteredOtp }),
        }
      );

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok || !verifyData.success) {
        throw new Error(verifyData.message || "OTP verification failed");
      }

      const checkoutResponse = await fetch(
        `http://localhost:5000/api/visitors/checkout/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!checkoutResponse.ok) {
        throw new Error("Failed to check out visitor");
      }

      toast.success("OTP verified! Checking out...", {
        position: "top-right",
        autoClose: 2000,
      });
      setVisitors((prev) => prev.filter((v) => v.id !== id));
      setGeneratedOtps((prev) => {
        const newOtps = { ...prev };
        delete newOtps[id];
        return newOtps;
      });
      navigate("/success");
    } catch (error) {
      toast.error(error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  // const handleViewAssets = (visitor) => {
  //   setSelectedVisitor(visitor);
  //   setOpenModal(true);
  // };

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
                    sm: "40px 150px 200px 150px 100px 120px 150px 300px", // Adjusted for extra button
                  },
                  gap: 1,
                  bgcolor: "#e0e0e0",
                  p: 1,
                  borderRadius: 1,
                  fontWeight: "bold",
                  alignItems: "center",
                  minWidth: "1270px", // Adjusted for wider column
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
                      sm: "40px 150px 200px 150px 100px 120px 150px 300px", // Adjusted for extra button
                    },
                    gap: 1,
                    p: 1,
                    borderBottom: "1px solid #e0e0e0",
                    alignItems: "center",
                    minWidth: "1270px", // Adjusted for wider column
                  }}
                >
                  <Box
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap falso",
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
                        placeholder="OTP"
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
                        onClick={() => handleGenerateOtp(visitor)}
                      >
                        Generate OTP
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
                      {/* <Button
                        variant="contained"
                        size="small"
                        sx={{
                          ...buttonStyles,
                          bgcolor: "purple",
                          color: "white",
                          "&:hover": { bgcolor: "darkpurple" },
                        }}
                        onClick={() => handleViewAssets(visitor)}
                      >
                        View Assets
                      </Button> */}
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

      <Dialog
        open={openModal}
        onClose={() => setOpenModal(false)}
        fullWidth
        maxWidth="sm"
        sx={{ "& .MuiDialog-paper": { width: { xs: "90%", sm: "auto" } } }}
      >
        <DialogTitle>Asset Details</DialogTitle>
        <DialogContent>
          {selectedVisitor && selectedVisitor.assets.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 1,
                mt: 2,
              }}
            >
              <Typography variant="subtitle1">
                <strong>Type</strong>
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{ display: { xs: "none", sm: "block" } }}
              >
                <strong>Serial Number</strong>
              </Typography>
              {selectedVisitor.assets.map((asset, index) => (
                <React.Fragment key={index}>
                  <Box>{asset.type}</Box>
                  <Box>{asset.serialNumber}</Box>
                </React.Fragment>
              ))}
            </Box>
          ) : (
            <Typography color="error" sx={{ textAlign: "center", mt: 2 }}>
              No assets available
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </Box>
  );
};

const SuccessPage = () => {
  const navigate = useNavigate();

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