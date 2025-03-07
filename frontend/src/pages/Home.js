// // import React, { useState } from "react";
// // import Navbar from "../components/Navbar";
// // import {
// //   Typography,
// //   Container,
// //   Grid,
// //   Paper,
// //   Card,
// //   CardContent,
// //   Box,
// //   CircularProgress,
// //   Avatar,
// //   useMediaQuery,
// //   useTheme,
// // } from "@mui/material";
// // import { DataGrid } from "@mui/x-data-grid";
// // import {
// //   TrendingUp,
// //   People,
// //   CheckCircle,
// //   Cancel,
// //   DirectionsCar,
// // } from "@mui/icons-material";
// // import {
// //   LineChart,
// //   Line,
// //   XAxis,
// //   YAxis,
// //   Tooltip,
// //   CartesianGrid,
// //   ResponsiveContainer,
// //   BarChart,
// //   Bar,
// //   Cell,
// // } from "recharts";

// // // Sample Data for Charts
// // const chartData = [
// //   { name: "Jan", visits: 20 },
// //   { name: "Feb", visits: 40 },
// //   { name: "Mar", visits: 30 },
// //   { name: "Apr", visits: 60 },
// //   { name: "May", visits: 50 },
// //   { name: "Jun", visits: 80 },
// // ];

// // const meterData = [
// //   { name: "Checked-In", value: 50, color: "#0088FE" },
// //   { name: "Checked-Out", value: 70, color: "#00C49F" },
// //   { name: "Pending", value: 15, color: "#FFBB28" },
// // ];

// // const stats = [
// //   { title: "Total Visitors", value: 120, icon: <People />, color: "#673ab7" },
// //   { title: "Checked-In", value: 50, icon: <CheckCircle />, color: "#4caf50" },
// //   { title: "Checked-Out", value: 70, icon: <Cancel />, color: "#f44336" },
// //   { title: "Pending", value: 15, icon: <TrendingUp />, color: "#ff9800" },
// //   { title: "Vehicles", value: 45, icon: <DirectionsCar />, color: "#3f51b5" },
// // ];

// // function Home() {
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);

// //   const theme = useTheme();
// //   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
// //   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

// //   const sampleVisitors = [
// //     {
// //       id: 1,
// //       img: "https://randomuser.me/api/portraits/men/1.jpg",
// //       firstName: "John",
// //       lastName: "Doe",
// //       email: "john.doe@example.com",
// //       company: "Tech Corp",
// //       phone: "123-456-7890",
// //       checkIn: "2025-03-06 10:00 AM",
// //       checkOut: "2025-03-06 05:00 PM",
// //     },
// //     {
// //       id: 2,
// //       img: "https://randomuser.me/api/portraits/women/2.jpg",
// //       firstName: "Jane",
// //       lastName: "Smith",
// //       email: "jane.smith@example.com",
// //       company: "Innovate Ltd",
// //       phone: "987-654-3210",
// //       checkIn: "2025-03-06 09:30 AM",
// //       checkOut: "2025-03-06 04:00 PM",
// //     },
// //     {
// //       id: 3,
// //       img: "https://randomuser.me/api/portraits/men/3.jpg",
// //       firstName: "Michael",
// //       lastName: "Brown",
// //       email: "michael.brown@example.com",
// //       company: "Alpha Solutions",
// //       phone: "555-234-5678",
// //       checkIn: "2025-03-06 11:00 AM",
// //       checkOut: "2025-03-06 06:00 PM",
// //     },
// //     {
// //       id: 4,
// //       img: "https://randomuser.me/api/portraits/women/4.jpg",
// //       firstName: "Emily",
// //       lastName: "Clark",
// //       email: "emily.clark@example.com",
// //       company: "Beta Tech",
// //       phone: "222-333-4444",
// //       checkIn: "2025-03-06 08:45 AM",
// //       checkOut: "2025-03-06 03:30 PM",
// //     },
// //     {
// //       id: 5,
// //       img: "https://randomuser.me/api/portraits/men/5.jpg",
// //       firstName: "David",
// //       lastName: "Wilson",
// //       email: "david.wilson@example.com",
// //       company: "Gamma Enterprises",
// //       phone: "666-777-8888",
// //       checkIn: "2025-03-06 12:15 PM",
// //       checkOut: "2025-03-06 07:00 PM",
// //     },
// //     {
// //       id: 6,
// //       img: "https://randomuser.me/api/portraits/women/6.jpg",
// //       firstName: "Sophia",
// //       lastName: "Martinez",
// //       email: "sophia.martinez@example.com",
// //       company: "Delta Solutions",
// //       phone: "999-888-7777",
// //       checkIn: "2025-03-06 10:45 AM",
// //       checkOut: "2025-03-06 05:30 PM",
// //     },
// //     {
// //       id: 7,
// //       img: "https://randomuser.me/api/portraits/men/7.jpg",
// //       firstName: "James",
// //       lastName: "Anderson",
// //       email: "james.anderson@example.com",
// //       company: "Epsilon Tech",
// //       phone: "444-555-6666",
// //       checkIn: "2025-03-06 07:30 AM",
// //       checkOut: "2025-03-06 02:00 PM",
// //     },
// //     {
// //       id: 8,
// //       img: "https://randomuser.me/api/portraits/women/8.jpg",
// //       firstName: "Olivia",
// //       lastName: "Harris",
// //       email: "olivia.harris@example.com",
// //       company: "Zeta Industries",
// //       phone: "123-321-1234",
// //       checkIn: "2025-03-06 01:00 PM",
// //       checkOut: "2025-03-06 08:00 PM",
// //     },
// //     {
// //       id: 9,
// //       img: "https://randomuser.me/api/portraits/men/9.jpg",
// //       firstName: "Daniel",
// //       lastName: "White",
// //       email: "daniel.white@example.com",
// //       company: "Theta Systems",
// //       phone: "777-666-5555",
// //       checkIn: "2025-03-06 09:15 AM",
// //       checkOut: "2025-03-06 04:45 PM",
// //     },
// //     {
// //       id: 10,
// //       img: "https://randomuser.me/api/portraits/women/10.jpg",
// //       firstName: "Emma",
// //       lastName: "Moore",
// //       email: "emma.moore@example.com",
// //       company: "Sigma Solutions",
// //       phone: "321-654-9870",
// //       checkIn: "2025-03-06 11:30 AM",
// //       checkOut: "2025-03-06 06:15 PM",
// //     },
// //   ];

// //   const [visitors, setVisitors] = useState(sampleVisitors);

// //   // Adjust column visibility and width for responsiveness
// //   const columns = [
// //     {
// //       field: "img",
// //       headerName: "Image",
// //       width: isMobile ? 70 : 100,
// //       renderCell: (params) => (
// //         <Avatar src={params.value} sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }} />
// //       ),
// //     },
// //     { field: "firstName", headerName: "First Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
// //     { field: "lastName", headerName: "Last Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
// //     { field: "email", headerName: "Email", flex: isMobile ? 0 : 1.5, width: isMobile ? 150 : undefined, hide: isMobile },
// //     { field: "company", headerName: "Company", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
// //     { field: "phone", headerName: "Phone", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
// //     { field: "checkIn", headerName: "Check-In", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
// //     { field: "checkOut", headerName: "Check-Out", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
// //   ];

// //   return (
// //     <>
// //       <Navbar />

// //       <Grid container spacing={isMobile ? 1 : 2} mt={isMobile ? 1 : 2} px={isMobile ? 1 : 2}>
// //         {/* Left Main Container */}
// //         <Grid item xs={12} md={8}>
// //           <Container
// //             sx={{
// //               bgcolor: "#f8f9fa",
// //               py: isMobile ? 2 : 3,
// //               px: isMobile ? 2 : 3,
// //               borderRadius: "20px",
// //               boxShadow: 3,
// //               height: isMobile ? "auto" : "800px",
// //             }}
// //           >
// //             {/* Stats Cards */}
// //             <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
// //               {stats.map((stat, index) => (
// //                 <Grid item xs={6} sm={4} md={2.2} key={index}> {/* Adjusted md to 2.2 to prevent overlap */}
// //                   <Card
// //                     sx={{
// //                       bgcolor: stat.color,
// //                       color: "white",
// //                       textAlign: "center",
// //                       p: isMobile ? 1 : 2,
// //                       borderRadius: 2, // Kept border radius as it was
// //                       height: 100, // Kept height as it was
// //                     }}
// //                   >
// //                     <CardContent>
// //                       <Box
// //                         display="flex"
// //                         flexDirection="column"
// //                         alignItems="center"
// //                       >
// //                         {stat.icon}
// //                         <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}>
// //                           {stat.title}
// //                         </Typography>
// //                         <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
// //                           {stat.value}
// //                         </Typography>
// //                       </Box>
// //                     </CardContent>
// //                   </Card>
// //                 </Grid>
// //               ))}
// //             </Grid>

// //             {/* Visitor Container with Increased Gap */}
// //             <Box mt={isMobile ? 6 : 8}> {/* Gap between cards and visitor container */}
// //               <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
// //                 <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
// //                   Visitors
// //                 </Typography>

// //                 {loading ? (
// //                   <Box
// //                     display="flex"
// //                     justifyContent="center"
// //                     alignItems="center"
// //                     py={4}
// //                   >
// //                     <CircularProgress />
// //                   </Box>
// //                 ) : error ? (
// //                   <Typography variant="body1" color="error" align="center">
// //                     {error}
// //                   </Typography>
// //                 ) : (
// //                   <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
// //                     <DataGrid
// //                       rows={visitors}
// //                       columns={columns}
// //                       autoHeight
// //                       disableColumnMenu
// //                       pageSizeOptions={[5, 7]}
// //                       initialState={{
// //                         pagination: { paginationModel: { pageSize: isMobile ? 5 : 7 } },
// //                       }}
// //                       sx={{
// //                         "& .MuiDataGrid-root": {
// //                           minWidth: isMobile ? 600 : "auto",
// //                         },
// //                       }}
// //                     />
// //                   </Box>
// //                 )}
// //               </Paper>
// //             </Box>
// //           </Container>
// //         </Grid>

// //         {/* Right-Side Container with Charts */}
// //         <Grid item xs={12} md={4}>
// //           <Container
// //             sx={{
// //               bgcolor: "#f8f9fa",
// //               py: isMobile ? 2 : 3,
// //               px: isMobile ? 2 : 3,
// //               borderRadius: "20px",
// //               boxShadow: 3,
// //               height: isMobile ? "auto" : "800px",
// //             }}
// //           >
// //             {/* Activity Chart */}
// //             <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2, mb: 3 }}>
// //               <Typography
// //                 variant={isMobile ? "h6" : "h5"}
// //                 gutterBottom
// //                 sx={{
// //                   textAlign: "center",
// //                   fontWeight: "bold",
// //                   color: "#333",
// //                   mb: 2,
// //                 }}
// //               >
// //                 Activity Chart
// //               </Typography>
// //               <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
// //                 <LineChart data={chartData}>
// //                   <CartesianGrid strokeDasharray="3 3" />
// //                   <XAxis dataKey="name" tick={{ fontSize: isMobile ? 12 : 14 }} />
// //                   <YAxis tick={{ fontSize: isMobile ? 12 : 14 }} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       fontSize: isMobile ? 12 : 14,
// //                       backgroundColor: "rgba(255, 255, 255, 0.95)",
// //                       borderRadius: "8px",
// //                       border: "1px solid #ddd",
// //                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// //                     }}
// //                   />
// //                   <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={isMobile ? 1 : 2} />
// //                 </LineChart>
// //               </ResponsiveContainer>
// //             </Paper>

// //             {/* Visitor Status Overview */}
// //             <Paper
// //               elevation={8}
// //               sx={{
// //                 p: isMobile ? 2 : 4,
// //                 borderRadius: "10px",
// //                 bgcolor: "#fff",
// //                 boxShadow: 4,
// //                 height: isMobile ? 280 : 320,
// //               }}
// //             >
// //               <Typography
// //                 variant={isMobile ? "h6" : "h5"}
// //                 gutterBottom
// //                 sx={{
// //                   textAlign: "center",
// //                   fontWeight: "bold",
// //                   color: "#333",
// //                   mb: 2,
// //                 }}
// //               >
// //                 Visitor Status Overview
// //               </Typography>

// //               <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
// //                 <BarChart
// //                   data={meterData}
// //                   margin={{ top: 20, right: isMobile ? 10 : 20, left: 0, bottom: 20 }}
// //                 >
// //                   <defs>
// //                     <linearGradient id="colorCheckedIn" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
// //                       <stop offset="95%" stopColor="#0088FE" stopOpacity={0.3} />
// //                     </linearGradient>
// //                     <linearGradient id="colorCheckedOut" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
// //                       <stop offset="95%" stopColor="#00C49F" stopOpacity={0.3} />
// //                     </linearGradient>
// //                     <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
// //                       <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
// //                       <stop offset="95%" stopColor="#FFBB28" stopOpacity={0.3} />
// //                     </linearGradient>
// //                   </defs>
// //                   <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
// //                   <XAxis dataKey="name" tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
// //                   <YAxis tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
// //                   <Tooltip
// //                     contentStyle={{
// //                       fontSize: isMobile ? 12 : 14,
// //                       backgroundColor: "rgba(255, 255, 255, 0.95)",
// //                       borderRadius: "8px",
// //                       border: "1px solid #ddd",
// //                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
// //                     }}
// //                   />
// //                   <Bar dataKey="value" radius={[10, 10, 0, 0]}>
// //                     {meterData.map((entry, index) => (
// //                       <Cell
// //                         key={`cell-${index}`}
// //                         fill={`url(#color${entry.name.replace("-", "")})`}
// //                       />
// //                     ))}
// //                   </Bar>
// //                 </BarChart>
// //               </ResponsiveContainer>
// //             </Paper>
// //           </Container>
// //         </Grid>
// //       </Grid>
// //     </>
// //   );
// // }

// // export default Home;



// import React, { useState, useEffect } from "react";
// import Navbar from "../components/Navbar";
// import {
//   Typography,
//   Container,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   Box,
//   CircularProgress,
//   Avatar,
//   useMediaQuery,
//   useTheme,
// } from "@mui/material";
// import { DataGrid } from "@mui/x-data-grid";
// import {
//   TrendingUp,
//   People,
//   CheckCircle,
//   Cancel,
//   DirectionsCar,
// } from "@mui/icons-material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   Cell,
// } from "recharts";

// function Home() {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [visitors, setVisitors] = useState([]);
//   const [chartData, setChartData] = useState([]);
//   const [meterData, setMeterData] = useState([]);
//   const [stats, setStats] = useState([
//     { title: "Total Visitors", value: 0, icon: <People />, color: "#673ab7" },
//     { title: "Checked-In", value: 0, icon: <CheckCircle />, color: "#4caf50" },
//     { title: "Checked-Out", value: 0, icon: <Cancel />, color: "#f44336" },
//     { title: "Pending", value: 0, icon: <TrendingUp />, color: "#ff9800" },
//     { title: "Vehicles", value: 0, icon: <DirectionsCar />, color: "#3f51b5" },
//   ]);

//   const theme = useTheme();
//   const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
//   const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

//   // Fetch data from backend
//   useEffect(() => {
//     const fetchVisitors = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("http://localhost:5000/api/visitors");
//         if (!response.ok) {
//           throw new Error("Failed to fetch visitor data");
//         }
//         const rawData = await response.json();
//         console.log("Raw response data:", rawData); // Log the raw data for debugging

//         // Handle different response formats
//         let data;
//         if (Array.isArray(rawData)) {
//           data = rawData; // If it's already an array
//         } else if (rawData.data && Array.isArray(rawData.data)) {
//           data = rawData.data; // If it's an object with a 'data' field containing an array
//         } else {
//           throw new Error("Unexpected data format from backend");
//         }

//         // Transform backend data to match column definitions
//         const transformedVisitors = data.map(visitor => ({
//           id: visitor._id, // Use _id as the unique id
//           img: visitor.photo || "https://randomuser.me/api/portraits/men/1.jpg", // Use photo if available, else fallback
//           firstName: visitor.fullName ? visitor.fullName.split(" ")[0] : "", // Extract first name from fullName
//           lastName: visitor.fullName ? visitor.fullName.split(" ")[1] || "" : "", // Extract last name from fullName
//           email: visitor.email || "",
//           company: visitor.visitorCompany || "",
//           phone: visitor.phoneNumber || "",
//           checkIn: visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleString() : visitor.time || "", // Use checkInTime or time
//           checkOut: visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : "",
//           reasonForVisit: visitor.reasonForVisit || "",
//           personToVisit: visitor.personToVisit || "",
//           designation: visitor.designation || "",
//           vehicle: visitor.vehicle ? true : false, // Convert vehicle ID to boolean if needed
//         }));

//         setVisitors(transformedVisitors);

//         // Calculate stats from the transformed data
//         const totalVisitors = transformedVisitors.length;
//         const checkedIn = transformedVisitors.filter(v => v.checkIn && !v.checkOut).length;
//         const checkedOut = transformedVisitors.filter(v => v.checkOut).length;
//         const pending = transformedVisitors.filter(v => !v.checkIn && !v.checkOut).length;
//         const vehicles = transformedVisitors.filter(v => v.vehicle).length;

//         setStats([
//           { ...stats[0], value: totalVisitors },
//           { ...stats[1], value: checkedIn },
//           { ...stats[2], value: checkedOut },
//           { ...stats[3], value: pending },
//           { ...stats[4], value: vehicles },
//         ]);

//         // Prepare meter data
//         setMeterData([
//           { name: "Checked-In", value: checkedIn, color: "#0088FE" },
//           { name: "Checked-Out", value: checkedOut, color: "#00C49F" },
//           { name: "Pending", value: pending, color: "#FFBB28" },
//         ]);

//         // Prepare chart data (aggregate by month)
//         const monthlyVisits = transformedVisitors.reduce((acc, visitor) => {
//           if (visitor.checkIn) {
//             const date = new Date(visitor.checkIn);
//             const month = date.toLocaleString('default', { month: 'short' });
//             acc[month] = (acc[month] || 0) + 1;
//           }
//           return acc;
//         }, {});
        
//         setChartData(Object.entries(monthlyVisits).map(([name, visits]) => ({
//           name,
//           visits
//         })));

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVisitors();
//   }, []);

//   const columns = [
//     {
//       field: "img",
//       headerName: "Image",
//       width: isMobile ? 70 : 100,
//       renderCell: (params) => (
//         <Avatar src={params.value} sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }} />
//       ),
//     },
//     { field: "firstName", headerName: "First Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
//     { field: "lastName", headerName: "Last Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
//     { field: "email", headerName: "Email", flex: isMobile ? 0 : 1.5, width: isMobile ? 150 : undefined, hide: isMobile },
//     { field: "company", headerName: "Company", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
//     { field: "phone", headerName: "Phone", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
//     { field: "checkIn", headerName: "Check-In", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
//     { field: "checkOut", headerName: "Check-Out", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
//     { field: "reasonForVisit", headerName: "Purpose", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
//     { field: "personToVisit", headerName: "Host", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
//     { field: "designation", headerName: "Designation", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
//   ];

//   return (
//     <>
//       <Navbar />

//       <Grid container spacing={isMobile ? 1 : 2} mt={isMobile ? 1 : 2} px={isMobile ? 1 : 2}>
//         {/* Left Main Container */}
//         <Grid item xs={12} md={8}>
//           <Container
//             sx={{
//               bgcolor: "#f8f9fa",
//               py: isMobile ? 2 : 3,
//               px: isMobile ? 2 : 3,
//               borderRadius: "20px",
//               boxShadow: 3,
//               height: isMobile ? "auto" : "800px",
//             }}
//           >
//             {/* Stats Cards */}
//             <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
//               {stats.map((stat, index) => (
//                 <Grid item xs={6} sm={4} md={2.2} key={index}>
//                   <Card
//                     sx={{
//                       bgcolor: stat.color,
//                       color: "white",
//                       textAlign: "center",
//                       p: isMobile ? 1 : 2,
//                       borderRadius: 2,
//                       height: 100,
//                     }}
//                   >
//                     <CardContent>
//                       <Box
//                         display="flex"
//                         flexDirection="column"
//                         alignItems="center"
//                       >
//                         {stat.icon}
//                         <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}>
//                           {stat.title}
//                         </Typography>
//                         <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
//                           {stat.value}
//                         </Typography>
//                       </Box>
//                     </CardContent>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Visitor Container */}
//             <Box mt={isMobile ? 6 : 8}>
//               <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
//                 <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
//                   Visitors
//                 </Typography>

//                 {loading ? (
//                   <Box
//                     display="flex"
//                     justifyContent="center"
//                     alignItems="center"
//                     py={4}
//                   >
//                     <CircularProgress />
//                   </Box>
//                 ) : error ? (
//                   <Typography variant="body1" color="error" align="center">
//                     {error}
//                   </Typography>
//                 ) : (
//                   <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
//                     <DataGrid
//                       rows={visitors}
//                       columns={columns}
//                       getRowId={(row) => row.id} // Specify _id as the row id
//                       autoHeight
//                       disableColumnMenu
//                       pageSizeOptions={[5, 7]}
//                       initialState={{
//                         pagination: { paginationModel: { pageSize: isMobile ? 5 : 7 } },
//                       }}
//                       sx={{
//                         "& .MuiDataGrid-root": {
//                           minWidth: isMobile ? 600 : "auto",
//                         },
//                       }}
//                     />
//                   </Box>
//                 )}
//               </Paper>
//             </Box>
//           </Container>
//         </Grid>

//         {/* Right-Side Container with Charts */}
//         <Grid item xs={12} md={4}>
//           <Container
//             sx={{
//               bgcolor: "#f8f9fa",
//               py: isMobile ? 2 : 3,
//               px: isMobile ? 2 : 3,
//               borderRadius: "20px",
//               boxShadow: 3,
//               height: isMobile ? "auto" : "800px",
//             }}
//           >
//             {/* Activity Chart */}
//             <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2, mb: 3 }}>
//               <Typography
//                 variant={isMobile ? "h6" : "h5"}
//                 gutterBottom
//                 sx={{
//                   textAlign: "center",
//                   fontWeight: "bold",
//                   color: "#333",
//                   mb: 2,
//                 }}
//               >
//                 Activity Chart
//               </Typography>
//               <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
//                 <LineChart data={chartData}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" tick={{ fontSize: isMobile ? 12 : 14 }} />
//                   <YAxis tick={{ fontSize: isMobile ? 12 : 14 }} />
//                   <Tooltip
//                     contentStyle={{
//                       fontSize: isMobile ? 12 : 14,
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       borderRadius: "8px",
//                       border: "1px solid #ddd",
//                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//                     }}
//                   />
//                   <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={isMobile ? 1 : 2} />
//                 </LineChart>
//               </ResponsiveContainer>
//             </Paper>

//             {/* Visitor Status Overview */}
//             <Paper
//               elevation={8}
//               sx={{
//                 p: isMobile ? 2 : 4,
//                 borderRadius: "10px",
//                 bgcolor: "#fff",
//                 boxShadow: 4,
//                 height: isMobile ? 280 : 320,
//               }}
//             >
//               <Typography
//                 variant={isMobile ? "h6" : "h5"}
//                 gutterBottom
//                 sx={{
//                   textAlign: "center",
//                   fontWeight: "bold",
//                   color: "#333",
//                   mb: 2,
//                 }}
//               >
//                 Visitor Status Overview
//               </Typography>

//               <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
//                 <BarChart
//                   data={meterData}
//                   margin={{ top: 20, right: isMobile ? 10 : 20, left: 0, bottom: 20 }}
//                 >
//                   <defs>
//                     <linearGradient id="colorCheckedIn" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#0088FE" stopOpacity={0.3} />
//                     </linearGradient>
//                     <linearGradient id="colorCheckedOut" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#00C49F" stopOpacity={0.3} />
//                     </linearGradient>
//                     <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
//                       <stop offset="95%" stopColor="#FFBB28" stopOpacity={0.3} />
//                     </linearGradient>
//                   </defs>
//                   <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
//                   <XAxis dataKey="name" tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
//                   <YAxis tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
//                   <Tooltip
//                     contentStyle={{
//                       fontSize: isMobile ? 12 : 14,
//                       backgroundColor: "rgba(255, 255, 255, 0.95)",
//                       borderRadius: "8px",
//                       border: "1px solid #ddd",
//                       boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
//                     }}
//                   />
//                   <Bar dataKey="value" radius={[10, 10, 0, 0]}>
//                     {meterData.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={`url(#color${entry.name.replace("-", "")})`}
//                       />
//                     ))}
//                   </Bar>
//                 </BarChart>
//               </ResponsiveContainer>
//             </Paper>
//           </Container>
//         </Grid>
//       </Grid>
//     </>
//   );
// }

// export default Home;






import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  TrendingUp,
  People,
  CheckCircle,
  Cancel,
  DirectionsCar,
} from "@mui/icons-material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [meterData, setMeterData] = useState([]);
  const [stats, setStats] = useState([
    { title: "Total Visitors", value: 0, icon: <People />, color: "#673ab7" },
    { title: "Checked-In", value: 0, icon: <CheckCircle />, color: "#4caf50" },
    { title: "Checked-Out", value: 0, icon: <Cancel />, color: "#f44336" },
    { title: "Pending", value: 0, icon: <TrendingUp />, color: "#ff9800" },
    { title: "Vehicles", value: 0, icon: <DirectionsCar />, color: "#3f51b5" },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/visitors");
        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }
        const rawData = await response.json();
        console.log("Raw response data:", rawData);

        let data;
        if (Array.isArray(rawData)) {
          data = rawData;
        } else if (rawData.data && Array.isArray(rawData.data)) {
          data = rawData.data;
        } else {
          throw new Error("Unexpected data format from backend");
        }

        const transformedVisitors = data.map(visitor => ({
          id: visitor._id,
          img: visitor.photo || "https://randomuser.me/api/portraits/men/1.jpg",
          firstName: visitor.fullName ? visitor.fullName.split(" ")[0] : "",
          lastName: visitor.fullName ? visitor.fullName.split(" ")[1] || "" : "",
          email: visitor.email || "",
          company: visitor.visitorCompany || "",
          phone: visitor.phoneNumber || "",
          checkIn: visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleString() : visitor.time || "",
          checkOut: visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleString() : "",
          reasonForVisit: visitor.reasonForVisit || "",
          personToVisit: visitor.personToVisit || "",
          designation: visitor.designation || "",
          vehicle: visitor.vehicle ? true : false,
        }));

        setVisitors(transformedVisitors);

        const totalVisitors = transformedVisitors.length;
        const checkedIn = transformedVisitors.filter(v => v.checkIn && !v.checkOut).length;
        const checkedOut = transformedVisitors.filter(v => v.checkOut).length;
        const pending = transformedVisitors.filter(v => !v.checkIn && !v.checkOut).length;
        const vehicles = transformedVisitors.filter(v => v.vehicle).length;

        setStats([
          { ...stats[0], value: totalVisitors },
          { ...stats[1], value: checkedIn },
          { ...stats[2], value: checkedOut },
          { ...stats[3], value: pending },
          { ...stats[4], value: vehicles },
        ]);

        setMeterData([
          { name: "Checked-In", value: checkedIn, color: "#0088FE" },
          { name: "Checked-Out", value: checkedOut, color: "#00C49F" },
          { name: "Pending", value: pending, color: "#FFBB28" },
        ]);

        const monthlyVisits = transformedVisitors.reduce((acc, visitor) => {
          if (visitor.checkIn) {
            const date = new Date(visitor.checkIn);
            const month = date.toLocaleString('default', { month: 'short' });
            acc[month] = (acc[month] || 0) + 1;
          }
          return acc;
        }, {});
        
        setChartData(Object.entries(monthlyVisits).map(([name, visits]) => ({
          name,
          visits
        })));

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: isMobile ? 70 : 100,
      renderCell: (params) => params.value.slice(-4) // Display last 4 digits
    },
    {
      field: "img",
      headerName: "Image",
      width: isMobile ? 70 : 100,
      renderCell: (params) => (
        <Avatar src={params.value} sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }} />
      ),
    },
    { field: "firstName", headerName: "First Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
    { field: "lastName", headerName: "Last Name", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
    { field: "email", headerName: "Email", flex: isMobile ? 0 : 1.5, width: isMobile ? 150 : undefined, hide: isMobile },
    { field: "company", headerName: "Company", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    { field: "phone", headerName: "Phone", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
    { field: "checkIn", headerName: "Check-In", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    { field: "checkOut", headerName: "Check-Out", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    { field: "reasonForVisit", headerName: "Purpose", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
    { field: "personToVisit", headerName: "Host", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
    { field: "designation", headerName: "Designation", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined, hide: isTablet },
  ];

  return (
    <>
      <Navbar />
      <Grid container spacing={isMobile ? 1 : 2} mt={isMobile ? 1 : 2} px={isMobile ? 1 : 2}>
        <Grid item xs={12} md={8}>
          <Container
            sx={{
              bgcolor: "#f8f9fa",
              py: isMobile ? 2 : 3,
              px: isMobile ? 2 : 3,
              borderRadius: "20px",
              boxShadow: 3,
              height: isMobile ? "auto" : "800px",
            }}
          >
            <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={4} md={2.2} key={index}>
                  <Card
                    sx={{
                      bgcolor: stat.color,
                      color: "white",
                      textAlign: "center",
                      p: isMobile ? 1 : 2,
                      borderRadius: 2,
                      height: 100,
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        {stat.icon}
                        <Typography variant={isMobile ? "body2" : "body1"} sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}>
                          {stat.title}
                        </Typography>
                        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}>
                          {stat.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={isMobile ? 6 : 8}>
              <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
                <Typography variant={isMobile ? "h6" : "h5"} gutterBottom>
                  Visitors
                </Typography>

                {loading ? (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    py={4}
                  >
                    <CircularProgress />
                  </Box>
                ) : error ? (
                  <Typography variant="body1" color="error" align="center">
                    {error}
                  </Typography>
                ) : (
                  <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
                    <DataGrid
                      rows={visitors}
                      columns={columns}
                      getRowId={(row) => row.id}
                      autoHeight
                      disableColumnMenu
                      pageSizeOptions={[5, 7]}
                      initialState={{
                        pagination: { paginationModel: { pageSize: isMobile ? 5 : 7 } },
                      }}
                      sx={{
                        "& .MuiDataGrid-root": {
                          minWidth: isMobile ? 600 : "auto",
                        },
                      }}
                    />
                  </Box>
                )}
              </Paper>
            </Box>
          </Container>
        </Grid>

        <Grid item xs={12} md={4}>
          <Container
            sx={{
              bgcolor: "#f8f9fa",
              py: isMobile ? 2 : 3,
              px: isMobile ? 2 : 3,
              borderRadius: "20px",
              boxShadow: 3,
              height: isMobile ? "auto" : "800px",
            }}
          >
            <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2, mb: 3 }}>
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                  mb: 2,
                }}
              >
                Activity Chart
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: isMobile ? 12 : 14 }} />
                  <YAxis tick={{ fontSize: isMobile ? 12 : 14 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: isMobile ? 12 : 14,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={isMobile ? 1 : 2} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            <Paper
              elevation={8}
              sx={{
                p: isMobile ? 2 : 4,
                borderRadius: "10px",
                bgcolor: "#fff",
                boxShadow: 4,
                height: isMobile ? 280 : 320,
              }}
            >
              <Typography
                variant={isMobile ? "h6" : "h5"}
                gutterBottom
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  color: "#333",
                  mb: 2,
                }}
              >
                Visitor Status Overview
              </Typography>

              <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                <BarChart
                  data={meterData}
                  margin={{ top: 20, right: isMobile ? 10 : 20, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient id="colorCheckedIn" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0088FE" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="colorCheckedOut" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00C49F" stopOpacity={0.3} />
                    </linearGradient>
                    <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFBB28" stopOpacity={0.3} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
                  <YAxis tick={{ fill: "#555", fontSize: isMobile ? 12 : 14 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: isMobile ? 12 : 14,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {meterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#color${entry.name.replace("-", "")})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Container>
        </Grid>
      </Grid>
    </>
  );
}

export default Home;