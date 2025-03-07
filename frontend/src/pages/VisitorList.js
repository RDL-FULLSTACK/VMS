// import React, { useState } from 'react';
// import { 
//   Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
//   TextField, Pagination
// } from '@mui/material';
// import Navbar from '../components/Navbar';
// import { useNavigate } from "react-router-dom";

// const VisitorList = () => {
//   const visitors = [
//     { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567', checkIn: '09:30 AM', checkOut: '05:30 PM', host: 'Sarah Wilson', designation: 'Vendor', date: '2025-03-01', 
//       assets: [{ type: 'Laptop', serialNumber: 'LAP123456' }, { type: 'Phone', serialNumber: 'PHN789012' }] 
//     },
//     { id: 2, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 (555) 987-6543', checkIn: '10:15 AM', checkOut: '04:45 PM', host: 'Michael Brown', designation: 'Client', date: '2025-03-02', 
//       assets: [{ type: 'Tablet', serialNumber: 'TAB456789' }]
//     },
//     { id: 3, name: 'James Wilson', email: 'james@example.com', phone: '+1 (555) 456-7890', checkIn: '11:00 AM', checkOut: '03:30 PM', host: 'Lisa Anderson', designation: 'Interview', date: '2025-03-01', 
//       assets: [] 
//     },
//     { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '+1 (555) 111-2222', checkIn: '08:00 AM', checkOut: '04:00 PM', host: 'Tom Lee', designation: 'Vendor', date: '2025-03-01', assets: [] },
//     { id: 5, name: 'Bob Johnson', email: 'bob@example.com', phone: '+1 (555) 333-4444', checkIn: '09:00 AM', checkOut: '05:00 PM', host: 'Jane Doe', designation: 'Client', date: '2025-03-02', assets: [{ type: 'Laptop', serialNumber: 'LAP987654' }] },
//     { id: 6, name: 'Carol White', email: 'carol@example.com', phone: '+1 (555) 555-6666', checkIn: '10:00 AM', checkOut: '06:00 PM', host: 'Mike Smith', designation: 'Interview', date: '2025-03-01', assets: [] },
//     { id: 7, name: 'David Green', email: 'david@example.com', phone: '+1 (555) 777-8888', checkIn: '11:00 AM', checkOut: '07:00 PM', host: 'Sara Jones', designation: 'Vendor', date: '2025-03-02', assets: [{ type: 'Phone', serialNumber: 'PHN123456' }] },
//     { id: 8, name: 'Eve Black', email: 'eve@example.com', phone: '+1 (555) 999-0000', checkIn: '08:30 AM', checkOut: '04:30 PM', host: 'Paul Brown', designation: 'Client', date: '2025-03-01', assets: [] },
//     { id: 9, name: 'Frank Red', email: 'frank@example.com', phone: '+1 (555) 222-3333', checkIn: '09:30 AM', checkOut: '05:30 PM', host: 'Lisa White', designation: 'Interview', date: '2025-03-02', assets: [{ type: 'Tablet', serialNumber: 'TAB654321' }] },
//     { id: 10, name: 'Grace Blue', email: 'grace@example.com', phone: '+1 (555) 444-5555', checkIn: '10:30 AM', checkOut: '06:30 PM', host: 'John Green', designation: 'Vendor', date: '2025-03-01', assets: [] },
//     { id: 11, name: 'Henry Yellow', email: 'henry@example.com', phone: '+1 (555) 666-7777', checkIn: '11:30 AM', checkOut: '07:30 PM', host: 'Emma Black', designation: 'Client', date: '2025-03-02', assets: [{ type: 'Laptop', serialNumber: 'LAP456789' }] },
//     { id: 12, name: 'Ivy Purple', email: 'ivy@example.com', phone: '+1 (555) 888-9999', checkIn: '08:00 AM', checkOut: '04:00 PM', host: 'David Red', designation: 'Interview', date: '2025-03-01', assets: [] }
//   ];

//   const navigate = useNavigate();
//   const [selectedVisitor, setSelectedVisitor] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [page, setPage] = useState(1); // Pagination state
//   const rowsPerPage = 5; // Keeping 5 users per page (corrected from 6 to match your code)

//   const handleViewClick = (visitor) => {
//     setSelectedVisitor(visitor);
//     setOpenModal(true);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const filteredVisitors = visitors.filter((visitor) => {
//     const matchesSearch = `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.designation}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesDate = selectedDate ? visitor.date === selectedDate : true;
//     return matchesSearch && matchesDate;
//   });

//   // Calculate paginated visitors
//   const paginatedVisitors = filteredVisitors.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//         <Paper sx={{ p: 2, borderRadius: 1 }}>
//           <Typography variant="h6" gutterBottom>Visitor List</Typography>

//           <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//             <TextField
//               label="Search Visitor"
//               variant="outlined"
//               fullWidth
//               size="small"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <TextField
//               label="Filter by Date"
//               type="date"
//               variant="outlined"
//               size="small"
//               InputLabelProps={{ shrink: true }}
//               value={selectedDate}
//               onChange={(e) => setSelectedDate(e.target.value)}
//             />
//           </Box>

//           {/* Grid Header */}
//           <Box
//             sx={{
//               display: 'grid',
//               gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr', // Removed Assets Qty column
//               gap: 1,
//               bgcolor: '#e0e0e0',
//               p: 1,
//               borderRadius: 1,
//               fontWeight: 'bold',
//               alignItems: 'center',
//             }}
//           >
//             <Box>ID</Box>
//             <Box>Name</Box>
//             <Box>Email</Box>
//             <Box>Phone Number</Box>
//             <Box>Check In</Box>
//             <Box>Check Out</Box>
//             <Box>Host</Box>
//             <Box>Designation</Box>
//             <Box>Date</Box>
//             <Box>Assets</Box>
//             <Box textAlign={"center"}>Actions</Box>
//           </Box>

//           {/* Grid Body */}
//           {paginatedVisitors.map((visitor) => (
//             <Box
//               key={visitor.id}
//               sx={{
//                 display: 'grid',
//                 gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr', // Removed Assets Qty column
//                 gap: 1,
//                 p: 1,
//                 borderBottom: '1px solid #e0e0e0',
//                 alignItems: 'center',
//               }}
//             >
//               <Box>{visitor.id}</Box>
//               <Box>{visitor.name}</Box>
//               <Box>{visitor.email}</Box>
//               <Box>{visitor.phone}</Box>
//               <Box>{visitor.checkIn}</Box>
//               <Box>{visitor.checkOut}</Box>
//               <Box>{visitor.host}</Box>
//               <Box>{visitor.designation}</Box>
//               <Box>{visitor.date}</Box>
//               <Box>
//                 {visitor.assets.length > 0 ? (
//                   <Button 
//                     variant="contained" 
//                     color="primary" 
//                     onClick={() => handleViewClick(visitor)}
//                   >
//                     View
//                   </Button>
//                 ) : (
//                   <Button 
//                     variant="contained" 
//                     color="error"
//                     disabled
//                     sx={{ 
//                       py: 0.2,
//                       fontSize: '0.7rem',
//                       minWidth: 'auto'
//                     }}
//                   >
//                     No Assets
//                   </Button>
//                 )}
//               </Box>
//               <Box>
//                 <Box sx={{ display: 'flex', gap: 0.5 }}>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     sx={{ 
//                       py: 0.3,
//                       fontSize: '0.75rem',
//                       minWidth: 'auto',
//                       bgcolor: 'green',
//                       color: 'white',
//                       '&:hover': { bgcolor: 'darkgreen' }
//                     }}
//                     onClick={() => navigate(`/editcheckin/${visitor.id}`)}
//                   >
//                     Edit Check-In
//                   </Button>
//                   <Button
//                     variant="contained"
//                     size="small"
//                     sx={{ 
//                       py: 0.3,
//                       fontSize: '0.75rem',
//                       minWidth: 'auto',
//                       bgcolor: 'orange',
//                       color: 'white',
//                       '&:hover': { bgcolor: '#e68a00' }
//                     }}
//                     onClick={() => navigate(`/visitorcard/${visitor.id}`)}
//                   >
//                     Visitor Card
//                   </Button>
//                 </Box>
//               </Box>
//             </Box>
//           ))}

//           {/* Pagination */}
//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//             <Pagination
//               count={Math.ceil(filteredVisitors.length / rowsPerPage)}
//               page={page}
//               onChange={handleChangePage}
//               color="primary"
//             />
//           </Box>
//         </Paper>

//         {/* Modal for Asset Details */}
//         <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
//           <DialogTitle>Asset Details</DialogTitle>
//           <DialogContent>
//             {selectedVisitor && selectedVisitor.assets.length > 0 ? (
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
//                 <Typography variant="subtitle1"><strong>Type</strong></Typography>
//                 <Typography variant="subtitle1"><strong>Serial Number</strong></Typography>
//                 {selectedVisitor.assets.map((asset, index) => (
//                   <React.Fragment key={index}>
//                     <Box>{asset.type}</Box>
//                     <Box>{asset.serialNumber}</Box>
//                   </React.Fragment>
//                 ))}
//               </Box>
//             ) : (
//               <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
//                 No assets available
//               </Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </>
//   );
// };

// export default VisitorList;











// import React, { useState, useEffect } from 'react';
// import { 
//   Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
//   TextField, Pagination,CircularProgress
// } from '@mui/material';
// import Navbar from '../components/Navbar';
// import { useNavigate } from "react-router-dom";

// const VisitorList = () => {
//   const navigate = useNavigate();
//   const [visitors, setVisitors] = useState([]);
//   const [selectedVisitor, setSelectedVisitor] = useState(null);
//   const [openModal, setOpenModal] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedDate, setSelectedDate] = useState("");
//   const [page, setPage] = useState(1); // Pagination state
//   const rowsPerPage = 5; // Keeping 5 users per page
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

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
//           name: visitor.fullName || "", // Map fullName to name
//           email: visitor.email || "",
//           phone: visitor.phoneNumber || "",
//           checkIn: visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : visitor.time || "",
//           checkOut: visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "",
//           host: visitor.personToVisit || "",
//           designation: visitor.designation || "",
//           date: visitor.checkInTime ? new Date(visitor.checkInTime).toISOString().split('T')[0] : visitor.date || "",
//           assets: visitor.assets || [], // Map assets array if available
//         }));

//         setVisitors(transformedVisitors);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVisitors();
//   }, []);

//   const handleViewClick = (visitor) => {
//     setSelectedVisitor(visitor);
//     setOpenModal(true);
//   };

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const filteredVisitors = visitors.filter((visitor) => {
//     const matchesSearch = `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.designation}`
//       .toLowerCase()
//       .includes(searchTerm.toLowerCase());
//     const matchesDate = selectedDate ? visitor.date === selectedDate : true;
//     return matchesSearch && matchesDate;
//   });

//   // Calculate paginated visitors
//   const paginatedVisitors = filteredVisitors.slice(
//     (page - 1) * rowsPerPage,
//     page * rowsPerPage
//   );

//   return (
//     <>
//       <Navbar />
//       <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
//         <Paper sx={{ p: 2, borderRadius: 1 }}>
//           <Typography variant="h6" gutterBottom>Visitor List</Typography>

//           {loading ? (
//             <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
//               <CircularProgress />
//             </Box>
//           ) : error ? (
//             <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
//               {error}
//             </Typography>
//           ) : (
//             <>
//               <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
//                 <TextField
//                   label="Search Visitor"
//                   variant="outlined"
//                   fullWidth
//                   size="small"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//                 <TextField
//                   label="Filter by Date"
//                   type="date"
//                   variant="outlined"
//                   size="small"
//                   InputLabelProps={{ shrink: true }}
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 />
//               </Box>

//               {/* Grid Header */}
//               <Box
//                 sx={{
//                   display: 'grid',
//                   gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
//                   gap: 1,
//                   bgcolor: '#e0e0e0',
//                   p: 1,
//                   borderRadius: 1,
//                   fontWeight: 'bold',
//                   alignItems: 'center',
//                 }}
//               >
//                 <Box>ID</Box>
//                 <Box>Name</Box>
//                 <Box>Email</Box>
//                 <Box>Phone Number</Box>
//                 <Box>Check In</Box>
//                 <Box>Check Out</Box>
//                 <Box>Host</Box>
//                 <Box>Designation</Box>
//                 <Box>Date</Box>
//                 <Box>Assets</Box>
//                 <Box textAlign={"center"}>Actions</Box>
//               </Box>

//               {/* Grid Body */}
//               {paginatedVisitors.map((visitor) => (
//                 <Box
//                   key={visitor.id}
//                   sx={{
//                     display: 'grid',
//                     gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
//                     gap: 1,
//                     p: 1,
//                     borderBottom: '1px solid #e0e0e0',
//                     alignItems: 'center',
//                   }}
//                 >
//                   <Box>{visitor.id}</Box>
//                   <Box>{visitor.name}</Box>
//                   <Box>{visitor.email}</Box>
//                   <Box>{visitor.phone}</Box>
//                   <Box>{visitor.checkIn}</Box>
//                   <Box>{visitor.checkOut}</Box>
//                   <Box>{visitor.host}</Box>
//                   <Box>{visitor.designation}</Box>
//                   <Box>{visitor.date}</Box>
//                   <Box>
//                     {visitor.assets.length > 0 ? (
//                       <Button 
//                         variant="contained" 
//                         color="primary" 
//                         onClick={() => handleViewClick(visitor)}
//                       >
//                         View
//                       </Button>
//                     ) : (
//                       <Button 
//                         variant="contained" 
//                         color="error"
//                         disabled
//                         sx={{ 
//                           py: 0.2,
//                           fontSize: '0.7rem',
//                           minWidth: 'auto'
//                         }}
//                       >
//                         No Assets
//                       </Button>
//                     )}
//                   </Box>
//                   <Box>
//                     <Box sx={{ display: 'flex', gap: 0.5 }}>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         sx={{ 
//                           py: 0.3,
//                           fontSize: '0.75rem',
//                           minWidth: 'auto',
//                           bgcolor: 'green',
//                           color: 'white',
//                           '&:hover': { bgcolor: 'darkgreen' }
//                         }}
//                         onClick={() => navigate(`/editcheckin/${visitor.id}`)}
//                       >
//                         Edit Check-In
//                       </Button>
//                       <Button
//                         variant="contained"
//                         size="small"
//                         sx={{ 
//                           py: 0.3,
//                           fontSize: '0.75rem',
//                           minWidth: 'auto',
//                           bgcolor: 'orange',
//                           color: 'white',
//                           '&:hover': { bgcolor: '#e68a00' }
//                         }}
//                         onClick={() => navigate(`/visitorcard/${visitor.id}`)}
//                       >
//                         Visitor Card
//                       </Button>
//                     </Box>
//                   </Box>
//                 </Box>
//               ))}

//               {/* Pagination */}
//               <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//                 <Pagination
//                   count={Math.ceil(filteredVisitors.length / rowsPerPage)}
//                   page={page}
//                   onChange={handleChangePage}
//                   color="primary"
//                 />
//               </Box>
//             </>
//           )}

//         </Paper>

//         {/* Modal for Asset Details */}
//         <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
//           <DialogTitle>Asset Details</DialogTitle>
//           <DialogContent>
//             {selectedVisitor && selectedVisitor.assets.length > 0 ? (
//               <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
//                 <Typography variant="subtitle1"><strong>Type</strong></Typography>
//                 <Typography variant="subtitle1"><strong>Serial Number</strong></Typography>
//                 {selectedVisitor.assets.map((asset, index) => (
//                   <React.Fragment key={index}>
//                     <Box>{asset.type}</Box>
//                     <Box>{asset.serialNumber}</Box>
//                   </React.Fragment>
//                 ))}
//               </Box>
//             ) : (
//               <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
//                 No assets available
//               </Typography>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </>
//   );
// };

// export default VisitorList;

import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Pagination, CircularProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";

const VisitorList = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          name: visitor.fullName || "",
          email: visitor.email || "",
          phone: visitor.phoneNumber || "",
          checkIn: visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : visitor.time || "",
          checkOut: visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "",
          host: visitor.personToVisit || "",
          designation: visitor.designation || "",
          date: visitor.checkInTime ? new Date(visitor.checkInTime).toISOString().split('T')[0] : visitor.date || "",
          assets: visitor.assets || [],
        }));

        setVisitors(transformedVisitors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handleViewClick = (visitor) => {
    setSelectedVisitor(visitor);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.designation}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? visitor.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  const paginatedVisitors = filteredVisitors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Navbar />
      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Paper sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Visitor List</Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
              {error}
            </Typography>
          ) : (
            <>
              <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
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
                />
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
                  gap: 1,
                  bgcolor: '#e0e0e0',
                  p: 1,
                  borderRadius: 1,
                  fontWeight: 'bold',
                  alignItems: 'center',
                }}
              >
                <Box>ID</Box>
                <Box>Name</Box>
                <Box>Email</Box>
                <Box>Phone Number</Box>
                <Box>Check In</Box>
                <Box>Check Out</Box>
                <Box>Host</Box>
                <Box>Designation</Box>
                <Box>Date</Box>
                <Box>Assets</Box>
                <Box textAlign={"center"}>Actions</Box>
              </Box>

              {paginatedVisitors.map((visitor) => (
                <Box
                  key={visitor.id}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
                    gap: 1,
                    p: 1,
                    borderBottom: '1px solid #e0e0e0',
                    alignItems: 'center',
                  }}
                >
                  <Box>{visitor.id.slice(-4)}</Box>
                  <Box>{visitor.name}</Box>
                  <Box>{visitor.email}</Box>
                  <Box>{visitor.phone}</Box>
                  <Box>{visitor.checkIn}</Box>
                  <Box>{visitor.checkOut}</Box>
                  <Box>{visitor.host}</Box>
                  <Box>{visitor.designation}</Box>
                  <Box>{visitor.date}</Box>
                  <Box>
                    {visitor.assets.length > 0 ? (
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleViewClick(visitor)}
                      >
                        View
                      </Button>
                    ) : (
                      <Button 
                        variant="contained" 
                        color="error"
                        disabled
                        sx={{ 
                          py: 0.2,
                          fontSize: '0.7rem',
                          minWidth: 'auto'
                        }}
                      >
                        No Assets
                      </Button>
                    )}
                  </Box>
                  <Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ 
                          py: 0.3,
                          fontSize: '0.75rem',
                          minWidth: 'auto',
                          bgcolor: 'green',
                          color: 'white',
                          '&:hover': { bgcolor: 'darkgreen' }
                        }}
                        onClick={() => navigate(`/editcheckin/${visitor.id}`)}
                      >
                        Edit Check-In
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ 
                          py: 0.3,
                          fontSize: '0.75rem',
                          minWidth: 'auto',
                          bgcolor: 'orange',
                          color: 'white',
                          '&:hover': { bgcolor: '#e68a00' }
                        }}
                        onClick={() => navigate(`/visitorcard/${visitor.id}`)}
                      >
                        Visitor Card
                      </Button>
                    </Box>
                  </Box>
                </Box>
              ))}

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(filteredVisitors.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Paper>

        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Asset Details</DialogTitle>
          <DialogContent>
            {selectedVisitor && selectedVisitor.assets.length > 0 ? (
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 2 }}>
                <Typography variant="subtitle1"><strong>Type</strong></Typography>
                <Typography variant="subtitle1"><strong>Serial Number</strong></Typography>
                {selectedVisitor.assets.map((asset, index) => (
                  <React.Fragment key={index}>
                    <Box>{asset.type}</Box>
                    <Box>{asset.serialNumber}</Box>
                  </React.Fragment>
                ))}
              </Box>
            ) : (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                No assets available
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default VisitorList;