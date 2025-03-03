// // import React, { useEffect, useState } from "react";
// // import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
// // import { AppBar, Toolbar, Typography, Box, Button, Card, CardContent, Avatar, IconButton } from "@mui/material";
// // import { Delete, Edit } from "@mui/icons-material";
// // import axios from "axios";


// // const Navbar = () => {
// //   return (
// //     <AppBar position="static" sx={{ backgroundColor: "#673AB7" }}>
// //       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
// //         <Typography variant="h6">Visitor Management System</Typography>
// //         <Box>
// //           <Button color="inherit" component={Link} to="/">Dashboard</Button>
// //           <Button color="inherit" component={Link} to="/checkin">Check-In</Button>
// //           <Button color="inherit" component={Link} to="/pre-scheduling">Pre-Scheduling</Button>
// //           <Button color="inherit" component={Link} to="/checkout">Check-Out</Button>
// //           <Button color="inherit" component={Link} to="/admin">Admin Panel</Button>
// //         </Box>
// //       </Toolbar>
// //     </AppBar>
// //   );
// // };


// // const Admin1 = () => {
// //   const [visitors, setVisitors] = useState([]);
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     axios.get("http://localhost:5000/api/visitors") // backend devops use ur actual api
// //       .then((response) => setVisitors(response.data))
// //       .catch((error) => console.error("Error fetching visitors:", error));
// //   }, []);

// //   const handleDelete = (id) => {
// //     axios.delete(`http://localhost:5000/api/visitors/${id}`)    //  from the actual id of the visitor 
// //       .then(() => setVisitors(visitors.filter((v) => v.id !== id)))
// //       .catch((error) => console.error("Error deleting visitor:", error));
// //   };

// //   return (
// //     <Box sx={{ padding: 3 }}>
// //       {visitors.map((visitor) => (
// //         <Card key={visitor.id} sx={{ marginBottom: 2, borderLeft: "5px solid #673AB7", boxShadow: 3 }}>
// //           <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
// //             <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
// //               <Avatar sx={{ bgcolor: "#673AB7" }} />
// //               <Typography variant="h6">{visitor.fullName}</Typography>
// //               <Typography>{visitor.companyName}</Typography>
// //               <Typography>{visitor.phoneNumber}</Typography>
// //               <Typography>{visitor.email}</Typography>
// //             </Box>
// //             <Box>
// //               <IconButton color="primary" onClick={() => navigate(`/admin2/${visitor.id}`)}>
// //                 <Edit />
// //               </IconButton>
// //               <IconButton color="error" onClick={() => handleDelete(visitor.id)}>
// //                 <Delete />
// //               </IconButton>
// //             </Box>
// //           </CardContent>
// //         </Card>
// //       ))}
// //     </Box>
// //   );
// // };


// // export default Admin1;


// const adminData = [
//   {
//     id: 1,
//     img: "https://via.placeholder.com/50",
//     firstName: "John Doe",
//     company: "Tech Solutions",
//     phone: "123-456-7890",
//     email: "john@example.com",
//   },
//   {
//     id: 2,
//     img: "https://via.placeholder.com/50",
//     firstName: "Jane Smith",
//     company: "Innovate Inc",
//     phone: "987-654-3210",
//     email: "jane@example.com",
//   },
// ];

// function Admin1() {
//   const [data, setData] = useState(adminData);
//   const [open, setOpen] = useState(false);
//   const [deleteId, setDeleteId] = useState(null);
//   const navigate = useNavigate();

//   const handleDelete = () => {
//     setData(data.filter((item) => item.id !== deleteId));
//     setOpen(false);
//   };

//   return (
//     <>
//       <StyledAppBar position="static">
//         <ToolbarStyled>
//           <Typography variant="h6">Admin Panel</Typography>
//           <NavLinks>
//             <Button color="inherit" onClick={() => navigate("/")}>Dashboard</Button>
//             <Button color="inherit" onClick={() => navigate("/Checkin")}>Check-In</Button>
//             <Button color="inherit" onClick={() => navigate("/pre-scheduling")}>Pre-Scheduling</Button>
//             <Button color="inherit" onClick={() => navigate("/checkout")}>Check-Out</Button>
//             <Button color="inherit" onClick={() => navigate("/admin")}>Admin</Button>
//           </NavLinks>
//         </ToolbarStyled>
//       </StyledAppBar>

//       <StyledContainer maxWidth="lg">
//         <Typography variant="h4" style={{ marginTop: "24px" }}>Admin Management</Typography>

//         <TableContainerStyled component={Paper}>
//           <Table>
//             <TableHead>
//               <TableRow style={{ backgroundColor: "#eee" }}>
//                 <TableCell>Image</TableCell>
//                 <TableCell>First Name</TableCell>
//                 <TableCell>Visiting Company</TableCell>
//                 <TableCell>Phone Number</TableCell>
//                 <TableCell>Email</TableCell>
//                 <TableCell>Actions</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {data.map((admin) => (
//                 <TableRow key={admin.id}>
//                   <TableCell>
//                     <img src={admin.img} alt="profile" width={50} height={50} style={{ borderRadius: "50%" }} />
//                   </TableCell>
//                   <TableCell>{admin.firstName}</TableCell>
//                   <TableCell>{admin.company}</TableCell>
//                   <TableCell>{admin.phone}</TableCell>
//                   <TableCell>{admin.email}</TableCell>
//                   <TableCell>
//                     <IconButton color="primary" onClick={() => navigate("/admin2")}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton color="error" onClick={() => { setDeleteId(admin.id); setOpen(true); }}>
//                       <Delete />
//                     </IconButton>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainerStyled>
//       </StyledContainer>

//       <Dialog open={open} onClose={() => setOpen(false)}>
//         <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
//         <DialogActions>
//           <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
//           <Button onClick={handleDelete} color="error">Yes, Delete</Button>
//         </DialogActions>
//       </Dialog>
//     </>
//   );
// }


import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";

const StyledContainer = styled(Container)({
  backgroundColor: "#fbf6f6",
  color: "rgb(21, 20, 20)",
  minHeight: "100vh",
  padding: "16px",
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#673ab7 !important",
  width: "100%",
});

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
});

const NavLinks = styled("nav")({
  display: "flex",
  gap: "16px",
});

const TableContainerStyled = styled(TableContainer)({
  padding: "16px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  minHeight: "350px",
  marginTop: "24px",
});

const adminData = [
  {
    id: 1,
    img: "https://via.placeholder.com/50",
    firstName: "John Doe",
    company: "Tech Solutions",
    phone: "123-456-7890",
    email: "john@example.com",
  },
  {
    id: 2,
    img: "https://via.placeholder.com/50",
    firstName: "Jane Smith",
    company: "Innovate Inc",
    phone: "987-654-3210",
    email: "jane@example.com",
  },
];

function Admin() {
  const [data, setData] = useState(adminData);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== deleteId));
    setOpen(false);
  };

  return (
    <>
      <StyledAppBar position="static">
        <ToolbarStyled>
          <Typography variant="h6">Admin Panel</Typography>
          <NavLinks>
            <Button color="inherit" onClick={() => navigate("/")}>Dashboard</Button>
            <Button color="inherit" onClick={() => navigate("/Checkin")}>Check-In</Button>
            <Button color="inherit" onClick={() => navigate("/pre-scheduling")}>Pre-Scheduling</Button>
            <Button color="inherit" onClick={() => navigate("/checkout")}>Check-Out</Button>
            <Button color="inherit" onClick={() => navigate("/admin")}>Admin</Button>
          </NavLinks>
        </ToolbarStyled>
      </StyledAppBar>

      <StyledContainer maxWidth="lg">
        <Typography variant="h4" style={{ marginTop: "24px" }}>Admin Management</Typography>

        <TableContainerStyled component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#eee" }}>
                <TableCell>Image</TableCell>
                <TableCell>First Name</TableCell>
                <TableCell>Visiting Company</TableCell>
                <TableCell>Phone Number</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>
                    <img src={admin.img} alt="profile" width={50} height={50} style={{ borderRadius: "50%" }} />
                  </TableCell>
                  <TableCell>{admin.firstName}</TableCell>
                  <TableCell>{admin.company}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => navigate("/admin2")}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => { setDeleteId(admin.id); setOpen(true); }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainerStyled>
      </StyledContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">Cancel</Button>
          <Button onClick={handleDelete} color="error">Yes, Delete</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Admin;
