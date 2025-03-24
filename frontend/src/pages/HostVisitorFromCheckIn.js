// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Container,
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Button,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import axios from "axios";
// import Footer from"../components/Footer";

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// const HostVisitorFromCheckIn = () => {
//   const navigate = useNavigate();
//   const [visitors, setVisitors] = useState([]);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const visitorsPerPage = 10;
//   const [viewMode, setViewMode] = useState("Visitors");

//   const fetchVisitors = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/api/visitors");
//       console.log("Full API Response:", response);
//       console.log("Response Data:", response.data);

//       const visitorsArray = response.data.data || [];
//       if (!Array.isArray(visitorsArray)) {
//         throw new Error(
//           "Expected an array in response.data.data, but got: " +
//             typeof visitorsArray
//         );
//       }

//       const visitorsData = visitorsArray
//         .filter((visitor) => !visitor.checkOutTime)
//         .map((visitor) => ({
//           id: visitor._id || "Unknown ID",
//           name: visitor.fullName || visitor.name || "N/A",
//           company: visitor.visitorCompany || "N/A",
//           phone: visitor.phoneNumber || visitor.phone || "N/A",
//           Time: visitor.checkInTime
//             ? new Date(visitor.checkInTime).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })
//             : "N/A",
//           purpose: visitor.reasonForVisit || "N/A",
//           otp: visitor.otp || generateOTP(),
//           status: visitor.status || "Pending",
//         }));

//       console.log("Mapped Visitors:", visitorsData);
//       setVisitors(visitorsData);
//       setError(null);
//     } catch (error) {
//       console.error("Error fetching visitors:", error.message);
//       setVisitors([]);
//       setError(`Failed to fetch visitors: ${error.message}`);
//     }
//   };

//   useEffect(() => {
//     fetchVisitors();
//   }, []);

//   const regenerateOTP = async (id) => {
//     const newOtp = generateOTP();
//     try {
//       await axios.put(`http://localhost:5000/api/visitors/${id}`, { otp: newOtp });
//       const updatedVisitors = visitors.map((visitor) =>
//         visitor.id === id ? { ...visitor, otp: newOtp } : visitor
//       );
//       setVisitors(updatedVisitors);
//     } catch (error) {
//       console.error("Failed to regenerate OTP:", error);
//       setError("Failed to regenerate OTP");
//     }
//   };

//   const handleViewChange = (newView) => {
//     setViewMode(newView);
//     if (newView === "Pre-Schedules") {
//       navigate("/HostDashboard");
//     }
//   };

//   const indexOfLastVisitor = currentPage * visitorsPerPage;
//   const indexOfFirstVisitor = indexOfLastVisitor - visitorsPerPage;
//   const currentVisitors = visitors.slice(indexOfFirstVisitor, indexOfLastVisitor);

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
//       <Navbar />
//       <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
//         <Container maxWidth="lg">
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               justifyContent: "space-between",
//               alignItems: { xs: "flex-start", sm: "center" },
//               mb: 3,
//               gap: { xs: 2, sm: 0 },
//             }}
//           >
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: "bold",
//                 textAlign: { xs: "left", sm: "center" },
//                 fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1.75rem" },
//               }}
//             >
//               Visitors
//             </Typography>
//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: { xs: 1, sm: 2 },
//                 justifyContent: "flex-end",
//                 width: { xs: "100%", sm: "auto" },
//               }}
//             >
//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 1,
//                   bgcolor: "#e0e0e0",
//                   borderRadius: "20px",
//                   p: 0.5,
//                 }}
//               >
//                 <Button
//                   onClick={() => handleViewChange("Pre-Schedules")}
//                   sx={{
//                     bgcolor: viewMode === "Pre-Schedules" ? "#5F3B91" : "transparent",
//                     color: viewMode === "Pre-Schedules" ? "white" : "black",
//                     borderRadius: "20px",
//                     px: { xs: 1.5, sm: 2 },
//                     py: { xs: 0.3, sm: 0.5 },
//                     fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                     textTransform: "none",
//                     "&:hover": {
//                       bgcolor: viewMode === "Pre-Schedules" ? "#4a2c73" : "#d0d0d0",
//                     },
//                   }}
//                 >
//                   Approvals
//                 </Button>
//                 <Button
//                   onClick={() => handleViewChange("Visitors")}
//                   sx={{
//                     bgcolor: viewMode === "Visitors" ? "#5F3B91" : "transparent",
//                     color: viewMode === "Visitors" ? "white" : "black",
//                     borderRadius: "20px",
//                     px: { xs: 1.5, sm: 2 },
//                     py: { xs: 0.3, sm: 0.5 },
//                     fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                     textTransform: "none",
//                     "&:hover": {
//                       bgcolor: viewMode === "Visitors" ? "#4a2c73" : "#d0d0d0",
//                     },
//                   }}
//                 >
//                   Visitors
//                 </Button>
//               </Box>
//             </Box>
//           </Box>

//           {error && (
//             <Typography
//               color="error"
//               sx={{
//                 mb: 2,
//                 textAlign: "center",
//                 fontSize: { xs: "0.75rem", sm: "0.875rem" },
//               }}
//             >
//               {error}
//             </Typography>
//           )}

//           <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: { xs: 0.5, sm: 1 } }}>
//             <CardContent>
//               <Grid
//                 container
//                 spacing={1}
//                 alignItems="center"
//                 sx={{ display: { xs: "none", sm: "flex" } }}
//               >
//                 <Grid item xs={2}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Name
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={2}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Company
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={2}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Phone
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={1}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Time
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={2}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Purpose
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={1}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     OTP
//                   </Typography>
//                 </Grid>
//                 <Grid item xs={2}>
//                   <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                     Actions
//                   </Typography>
//                 </Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           {currentVisitors.length > 0 ? (
//             currentVisitors.map((visitor) => (
//               <Card
//                 key={visitor.id}
//                 sx={{
//                   mb: 2,
//                   bgcolor: "white",
//                   overflow: "hidden",
//                 }}
//               >
//                 <CardContent
//                   sx={{
//                     p: { xs: 1, sm: 2 },
//                     display: "flex",
//                     flexDirection: { xs: "column", sm: "row" },
//                     gap: { xs: 1, sm: 0 },
//                   }}
//                 >
//                   <Grid container spacing={1} alignItems="left" direction={{ xs: "column", sm: "row" }}>
//                     <Grid item xs={12} sm={2}>
//                       <Typography
//                         sx={{
//                           fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                           fontWeight: { xs: "bold", sm: "normal" },
//                         }}
//                       >
//                         {visitor.name}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={2}>
//                       <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                         {visitor.company}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={2}>
//                       <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                         {visitor.phone}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={1}>
//                       <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                         {visitor.Time}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={2}>
//                       <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
//                         {visitor.purpose}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={1}>
//                       <Typography
//                         sx={{
//                           fontWeight: "bold",
//                           color: "#D32F2F",
//                           fontSize: { xs: "0.875rem", sm: "1rem" },
//                         }}
//                       >
//                         {visitor.otp}
//                       </Typography>
//                     </Grid>
//                     <Grid item xs={12} sm={2}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           justifyContent: { xs: "flex-start", sm: "flex-end" },
//                           flexWrap: "wrap",
//                           gap: 1,
//                         }}
//                       >
//                         <Button
//                           variant="contained"
//                           color="primary"
//                           size="small"
//                           onClick={() => regenerateOTP(visitor.id)}
//                           sx={{
//                             fontSize: { xs: "0.65rem", sm: "0.75rem" },
//                             py: { xs: 0.3, sm: 0.5 },
//                             px: { xs: 1, sm: 2 },
//                           }}
//                         >
//                           Generate OTP
//                         </Button>
//                       </Box>
//                     </Grid>
//                   </Grid>
//                 </CardContent>
//               </Card>
//             ))
//           ) : (
//             <Typography
//               sx={{
//                 textAlign: "center",
//                 color: "gray",
//                 fontSize: { xs: "0.875rem", sm: "1rem" },
//                 mt: 2,
//               }}
//             >
//               No active visitors found.
//             </Typography>
//           )}

//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: { xs: "column", sm: "row" },
//               justifyContent: "center",
//               alignItems: "center",
//               mt: 2,
//               gap: { xs: 1, sm: 2 },
//             }}
//           >
//             <Button
//               variant="contained"
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage(currentPage - 1)}
//               sx={{
//                 fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                 minWidth: { xs: "100px", sm: "120px" },
//                 py: { xs: 0.5, sm: 1 },
//               }}
//             >
//               Previous
//             </Button>

//             <Typography
//               sx={{
//                 mx: { xs: 0, sm: 2 },
//                 fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                 textAlign: "center",
//               }}
//             >
//               Page {currentPage} of {Math.ceil(visitors.length / visitorsPerPage)}
//             </Typography>

//             <Button
//               variant="contained"
//               disabled={indexOfLastVisitor >= visitors.length}
//               onClick={() => setCurrentPage(currentPage + 1)}
//               sx={{
//                 fontSize: { xs: "0.75rem", sm: "0.875rem" },
//                 minWidth: { xs: "100px", sm: "120px" },
//                 py: { xs: 0.5, sm: 1 },
//               }}
//             >
//               Next
//             </Button>
//           </Box>
//         </Container>
//       </Box>
//       <Footer/>
//     </Box>
//   );
// };

// export default HostVisitorFromCheckIn;
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import Footer from "../components/Footer";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const HostVisitorFromCheckIn = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const visitorsPerPage = 10;
  const [viewMode, setViewMode] = useState("Visitors");

  // Retrieve the logged-in user from localStorage 'user' key
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const loggedInUser = user.username || "Unknown";
  console.log("Logged-in user:", loggedInUser);

  const fetchVisitors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/visitors");
      console.log("Full API Response:", response);
      console.log("Response Data:", response.data);

      const visitorsArray = response.data.data || [];
      if (!Array.isArray(visitorsArray)) {
        throw new Error(
          "Expected an array in response.data.data, but got: " +
            typeof visitorsArray
        );
      }

      const visitorsData = visitorsArray
        .filter((visitor) => !visitor.checkOutTime && visitor.personToVisit === loggedInUser) // Filter by personToVisit
        .map((visitor) => ({
          id: visitor._id || "Unknown ID",
          name: visitor.fullName || visitor.name || "N/A",
          company: visitor.visitorCompany || "N/A",
          phone: visitor.phoneNumber || visitor.phone || "N/A",
          Time: visitor.checkInTime
            ? new Date(visitor.checkInTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
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

  useEffect(() => {
    fetchVisitors();
  }, [loggedInUser]); // Dependency on loggedInUser

  const regenerateOTP = async (id) => {
    const newOtp = generateOTP();
    try {
      await axios.put(`http://localhost:5000/api/visitors/${id}`, { otp: newOtp });
      const updatedVisitors = visitors.map((visitor) =>
        visitor.id === id ? { ...visitor, otp: newOtp } : visitor
      );
      setVisitors(updatedVisitors);
    } catch (error) {
      console.error("Failed to regenerate OTP:", error);
      setError("Failed to regenerate OTP");
    }
  };

  const handleViewChange = (newView) => {
    setViewMode(newView);
    if (newView === "Pre-Schedules") {
      navigate("/HostDashboard");
    }
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
            </Box>
          </Box>

          {error && (
            <Typography
              color="error"
              sx={{
                mb: 2,
                textAlign: "center",
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                <Grid item xs={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Name
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Company
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Phone
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Time
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Purpose
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    OTP
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography fontWeight="bold" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Actions
                  </Typography>
                </Grid>
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
                  overflow: "hidden",
                }}
              >
                <CardContent
                  sx={{
                    p: { xs: 1, sm: 2 },
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: { xs: 1, sm: 0 },
                  }}
                >
                  <Grid container spacing={1} alignItems="left" direction={{ xs: "column", sm: "row" }}>
                    <Grid item xs={12} sm={2}>
                      <Typography
                        sx={{
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          fontWeight: { xs: "bold", sm: "normal" },
                        }}
                      >
                        {visitor.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.company}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.Time}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                      <Typography sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                        {visitor.purpose}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <Typography
                        sx={{
                          fontWeight: "bold",
                          color: "#D32F2F",
                          fontSize: { xs: "0.875rem", sm: "1rem" },
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
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => regenerateOTP(visitor.id)}
                          sx={{
                            fontSize: { xs: "0.65rem", sm: "0.75rem" },
                            py: { xs: 0.3, sm: 0.5 },
                            px: { xs: 1, sm: 2 },
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
                fontSize: { xs: "0.875rem", sm: "1rem" },
                mt: 2,
              }}
            >
              No active visitors found for this host.
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
                mx: { xs: 0, sm: 2 },
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                textAlign: "center",
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
      <Footer />
    </Box>
  );
};

export default HostVisitorFromCheckIn;