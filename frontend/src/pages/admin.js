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
