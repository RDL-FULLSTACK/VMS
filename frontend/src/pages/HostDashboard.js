// import React, { useState, useEffect } from "react";
// import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

// const visitorsData = [
//     { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting" },
//     { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview" }
// ];

// const HostDashboard = () => {
//     const navigate = useNavigate();
//     const [visitors, setVisitors] = useState([]);

//     useEffect(() => {
//         const storedData = JSON.parse(localStorage.getItem("visitors")) || [];
//         const today = new Date().toDateString(); // Get today's date as a string

//         if (storedData.length > 0 && storedData[0].date === today) {
//             // ✅ Keep existing OTPs if they are from today
//             setVisitors(storedData);
//         } else {
//             // 🔄 Generate new OTPs since it's a new day
//             const updatedVisitors = visitorsData.map(visitor => ({
//                 ...visitor,
//                 otp: generateOTP(),
//                 date: today, // Store the current date
//             }));

//             setVisitors(updatedVisitors);
//             localStorage.setItem("visitors", JSON.stringify(updatedVisitors));
//         }
//     }, []);

//     const regenerateOTP = (id) => {
//         const updatedVisitors = visitors.map(visitor =>
//             visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
//         );

//         setVisitors(updatedVisitors);
//         localStorage.setItem("visitors", JSON.stringify(updatedVisitors));
//     };

//     return (
//         <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
//             <Navbar />
//             <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
//                 <Container>
//                     <Typography 
//                         variant="h5" 
//                         sx={{ 
//                             mb: 3, 
//                             fontWeight: "bold", 
//                             textAlign: "center",
//                             fontSize: { xs: '1.5rem', sm: '1.75rem' } // Smaller on mobile
//                         }}
//                     >
//                         Host Panel
//                     </Typography>

//                     {/* Table Headers */}
//                     <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
//                         <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
//                             <Grid 
//                                 container 
//                                 spacing={1} 
//                                 alignItems="center" 
//                                 sx={{ 
//                                     display: { xs: 'none', sm: 'flex' } // Hide headers on mobile, show on larger screens
//                                 }}
//                             >
//                                 <Grid item xs={2}><Typography fontWeight="bold">Name</Typography></Grid>
//                                 <Grid item xs={2}><Typography fontWeight="bold">Company</Typography></Grid>
//                                 <Grid item xs={2}><Typography fontWeight="bold">Phone</Typography></Grid>
//                                 <Grid item xs={1}><Typography fontWeight="bold">Time</Typography></Grid>
//                                 <Grid item xs={2}><Typography fontWeight="bold">Purpose</Typography></Grid>
//                                 <Grid item xs={1}><Typography fontWeight="bold">OTP</Typography></Grid>
//                                 <Grid item xs={2}><Typography fontWeight="bold">Actions</Typography></Grid>
//                             </Grid>
//                         </CardContent>
//                     </Card>

//                     {/* Visitor List */}
//                     {visitors.map((visitor) => (
//                         <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
//                             <CardContent 
//                                 sx={{ 
//                                     p: { xs: 1, sm: 2 },
//                                     display: 'flex', 
//                                     flexDirection: { xs: 'column', sm: 'row' }, // Stack on mobile, row on larger screens
//                                     alignItems: { xs: 'flex-start', sm: 'center' },
//                                     gap: { xs: 1, sm: 0 }
//                                 }}
//                             >
//                                 <Grid container spacing={1} alignItems="center">
//                                     <Grid item xs={12} sm={2}>
//                                         <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
//                                             {visitor.name}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={2}>
//                                         <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
//                                             {visitor.company}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={2}>
//                                         <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
//                                             {visitor.phone}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={1}>
//                                         <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
//                                             {visitor.Time}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={2}>
//                                         <Typography sx={{ fontWeight: { xs: 'bold', sm: 'normal' } }}>
//                                             {visitor.purpose}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={1}>
//                                         <Typography 
//                                             sx={{ 
//                                                 fontWeight: "bold", 
//                                                 color: "#D32F2F",
//                                                 fontSize: { xs: '1.1rem', sm: '1rem' } // Larger OTP on mobile
//                                             }}
//                                         >
//                                             {visitor.otp}
//                                         </Typography>
//                                     </Grid>
//                                     <Grid item xs={12} sm={2}>
//                                         <Box 
//                                             sx={{ 
//                                                 display: 'flex', 
//                                                 flexDirection: { xs: 'row', sm: 'row' }, 
//                                                 gap: 1,
//                                                 justifyContent: { xs: 'flex-start', sm: 'flex-end' }
//                                             }}
//                                         >
//                                             <Button 
//                                                 variant="contained" 
//                                                 color="primary" 
//                                                 size="small"
//                                                 onClick={() => regenerateOTP(visitor.id)}
//                                                 sx={{ 
//                                                     fontSize: { xs: '0.7rem', sm: '0.875rem' }, 
//                                                     py: 0.5 
//                                                 }}
//                                             >
//                                                 Generate OTP
//                                             </Button>
//                                             {/* Uncomment if needed */}
//                                             {/* <IconButton 
//                                                 onClick={() => navigate(`/update-status/${visitor.id}`)} 
//                                                 sx={{ p: 0.5 }}
//                                             >
//                                                 <MoreVertIcon />
//                                             </IconButton> */}
//                                         </Box>
//                                     </Grid>
//                                 </Grid>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </Container>
//             </Box>
//         </Box>
//     );
// };

// export default HostDashboard;






// import React, { useState, useEffect } from "react";
// import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button, Popover } from "@mui/material";
// import MoreVertIcon from "@mui/icons-material/MoreVert";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import axios from "axios";

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

// const initialVisitorsData = [
//   { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting" },
//   { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview" },
// ];

// const HostDashboard = () => {
//   const navigate = useNavigate();
//   const [visitors, setVisitors] = useState([]);
//   const [anchorEl, setAnchorEl] = useState(null);

//   useEffect(() => {
//     const fetchPreSchedules = async () => {
//       try {
//         // Fetch pre-scheduled visitors from the backend
//         const response = await axios.get("http://localhost:5000/api/preschedules");
//         const preSchedules = response.data.map(pre => ({
//           ...pre,
//           id: pre._id, // Use MongoDB _id as id
//           company: pre.company || "N/A", // Default values if not present
//           phone: pre.phone || "N/A",
//           otp: generateOTP(), // Generate OTP on frontend
//         }));

//         // Combine with initial static data (optional)
//         const combinedVisitors = [
//           ...initialVisitorsData.map(v => ({ ...v, otp: generateOTP() })),
//           ...preSchedules,
//         ];

//         setVisitors(combinedVisitors);
//       } catch (error) {
//         console.error("Error fetching pre-schedules:", error);
//         // Fallback to initial data if API fails
//         setVisitors(initialVisitorsData.map(v => ({ ...v, otp: generateOTP() })));
//       }
//     };
//     fetchPreSchedules();
//   }, []);

//   const regenerateOTP = (id) => {
//     const updatedVisitors = visitors.map(visitor =>
//       visitor.id === id ? { ...visitor, otp: generateOTP() } : visitor
//     );
//     setVisitors(updatedVisitors);
//   };

//   const handleNotificationClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   const open = Boolean(anchorEl);
//   const id = open ? "notification-popover" : undefined;

//   return (
//     <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
//       <Navbar />
//       <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
//         <Container>
//           <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
//             <Typography
//               variant="h5"
//               sx={{
//                 fontWeight: "bold",
//                 textAlign: "center",
//                 fontSize: { xs: "1.5rem", sm: "1.75rem" },
//               }}
//             >
//               Host Panel
//             </Typography>
//             <IconButton onClick={handleNotificationClick}>
//               <NotificationsIcon sx={{ fontSize: 30, color: "#5F3B91" }} />
//               {visitors.filter(v => v.status === "Pending").length > 0 && (
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 5,
//                     right: 5,
//                     bgcolor: "red",
//                     borderRadius: "50%",
//                     width: 15,
//                     height: 15,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                     color: "white",
//                     fontSize: "10px",
//                   }}
//                 >
//                   {visitors.filter(v => v.status === "Pending").length}
//                 </Box>
//               )}
//             </IconButton>
//           </Box>

//           {/* Notification Popover */}
//           <Popover
//             id={id}
//             open={open}
//             anchorEl={anchorEl}
//             onClose={handleClose}
//             anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
//             transformOrigin={{ vertical: "top", horizontal: "right" }}
//           >
//             <Box sx={{ p: 2, maxWidth: 300 }}>
//               <Typography variant="h6">Notifications</Typography>
//               {visitors.filter(v => v.status === "Pending").length > 0 ? (
//                 visitors
//                   .filter(v => v.status === "Pending")
//                   .map(visitor => (
//                     <Box key={visitor.id} sx={{ mb: 1 }}>
//                       <Typography variant="body2">
//                         <strong>{visitor.name}</strong> scheduled a visit for <strong>{visitor.purpose}</strong> on{" "}
//                         {visitor.date}.
//                       </Typography>
//                     </Box>
//                   ))
//               ) : (
//                 <Typography variant="body2">No new notifications</Typography>
//               )}
//             </Box>
//           </Popover>

//           {/* Table Headers */}
//           <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
//             <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
//               <Grid
//                 container
//                 spacing={1}
//                 alignItems="center"
//                 sx={{ display: { xs: "none", sm: "flex" } }}
//               >
//                 <Grid item xs={2}><Typography fontWeight="bold">Name</Typography></Grid>
//                 <Grid item xs={2}><Typography fontWeight="bold">Company</Typography></Grid>
//                 <Grid item xs={2}><Typography fontWeight="bold">Phone</Typography></Grid>
//                 <Grid item xs={1}><Typography fontWeight="bold">Time</Typography></Grid>
//                 <Grid item xs={2}><Typography fontWeight="bold">Purpose</Typography></Grid>
//                 <Grid item xs={1}><Typography fontWeight="bold">OTP</Typography></Grid>
//                 <Grid item xs={2}><Typography fontWeight="bold">Actions</Typography></Grid>
//               </Grid>
//             </CardContent>
//           </Card>

//           {/* Visitor List */}
//           {visitors.map((visitor) => (
//             <Card key={visitor.id} sx={{ mb: 2, bgcolor: "white", color: "#000" }}>
//               <CardContent
//                 sx={{
//                   p: { xs: 1, sm: 2 },
//                   display: "flex",
//                   flexDirection: { xs: "column", sm: "row" },
//                   alignItems: { xs: "flex-start", sm: "center" },
//                   gap: { xs: 1, sm: 0 },
//                 }}
//               >
//                 <Grid container spacing={1} alignItems="center">
//                   <Grid item xs={12} sm={2}>
//                     <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
//                       {visitor.name}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={2}>
//                     <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
//                       {visitor.company}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={2}>
//                     <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
//                       {visitor.phone}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={1}>
//                     <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
//                       {visitor.Time}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={2}>
//                     <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
//                       {visitor.purpose}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={1}>
//                     <Typography
//                       sx={{
//                         fontWeight: "bold",
//                         color: "#D32F2F",
//                         fontSize: { xs: "1.1rem", sm: "1rem" },
//                       }}
//                     >
//                       {visitor.otp}
//                     </Typography>
//                   </Grid>
//                   <Grid item xs={12} sm={2}>
//                     <Box
//                       sx={{
//                         display: "flex",
//                         flexDirection: { xs: "row", sm: "row" },
//                         gap: 1,
//                         justifyContent: { xs: "flex-start", sm: "flex-end" },
//                       }}
//                     >
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         size="small"
//                         onClick={() => regenerateOTP(visitor.id)}
//                         sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, py: 0.5 }}
//                       >
//                         Generate OTP
//                       </Button>
//                     </Box>
//                   </Grid>
//                 </Grid>
//               </CardContent>
//             </Card>
//           ))}
//         </Container>
//       </Box>
//     </Box>
//   );
// };

// export default HostDashboard;




import React, { useState, useEffect } from "react";
import { Box, Container, Grid, Card, CardContent, Typography, IconButton, Button, Popover } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

const initialVisitorsData = [
  { id: 1, name: "John Doe", company: "ABC Corp", phone: "+1234567890", Time: "12:30", purpose: "Business Meeting", status: "Pending" },
  { id: 2, name: "Jane Smith", company: "XYZ Ltd", phone: "+9876543210", Time: "13:00", purpose: "Interview", status: "Pending" },
];

const HostDashboard = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchPreSchedules = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/preschedules");
        const preSchedules = response.data.map(pre => ({
          ...pre,
          id: pre._id,
          company: pre.company || "N/A",
          phone: pre.phone || "N/A",
          otp: generateOTP(),
          status: pre.status || "Pending", // Default to "Pending" if not provided
        }));

        const combinedVisitors = [
          ...initialVisitorsData.map(v => ({ ...v, otp: generateOTP() })),
          ...preSchedules,
        ];

        setVisitors(combinedVisitors);
      } catch (error) {
        console.error("Error fetching pre-schedules:", error);
        setVisitors(initialVisitorsData.map(v => ({ ...v, otp: generateOTP() })));
      }
    };
    fetchPreSchedules();
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

      // Update status in the backend
      await axios.put(`http://localhost:5000/api/preschedules/${id}`, { status: "Approved" });
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

      // Update status in the backend
      await axios.put(`http://localhost:5000/api/preschedules/${id}`, { status: "Rejected" });
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

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 3 } }}>
        <Container>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: "bold",
                textAlign: "center",
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              Host Panel
            </Typography>
            <IconButton onClick={handleNotificationClick}>
              <NotificationsIcon sx={{ fontSize: 30, color: "#5F3B91" }} />
              {visitors.filter(v => v.status === "Pending").length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 5,
                    bgcolor: "red",
                    borderRadius: "50%",
                    width: 15,
                    height: 15,
                    display: "flex",
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
          </Box>

          {/* Notification Popover */}
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
                <Typography variant="body2">No new notifications</Typography>
              )}
            </Box>
          </Popover>

          {/* Table Headers */}
          <Card sx={{ mb: 2, bgcolor: "#5F3B91", color: "white", p: 1 }}>
            <CardContent sx={{ p: { xs: 0.5, sm: 1 } }}>
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

          {/* Visitor List */}
          {visitors.map((visitor) => (
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
                      {visitor.company}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography sx={{ fontWeight: { xs: "bold", sm: "normal" } }}>
                      {visitor.phone}
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
                      sx={{
                        fontWeight: "bold",
                        color: "#D32F2F",
                        fontSize: { xs: "1.1rem", sm: "1rem" },
                      }}
                    >
                      {visitor.otp}
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
          ))}
        </Container>
      </Box>
    </Box>
  );
};

export default HostDashboard;