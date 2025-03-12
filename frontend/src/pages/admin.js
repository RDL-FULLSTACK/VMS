import React, { useState } from "react";
import {
  Typography,
  Container,
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
  DialogActions,
  useMediaQuery,
  Box,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Rest of the code remains unchanged
const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: "#fbf6f6",
  color: "rgb(21, 20, 20)",
  minHeight: "100vh",
  padding: "16px",
}));

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  padding: "16px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  minHeight: "350px",
  marginTop: "24px",
  overflowX: "auto",
}));

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
  const isMobile = useMediaQuery("(max-width: 600px)");

  const handleDelete = () => {
    setData(data.filter((item) => item.id !== deleteId));
    setOpen(false);
  };

  return (
    <>
      <Navbar />
      <StyledContainer maxWidth="lg">
        <Typography variant={isMobile ? "h5" : "h4"} style={{ marginTop: "24px", textAlign: "center" }}>
          Admin Management
        </Typography>

        <TableContainerStyled component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#eee" }}>
                {!isMobile && <TableCell>Image</TableCell>}
                <TableCell>First Name</TableCell>
                <TableCell>Visiting Company</TableCell>
                {!isMobile && <TableCell>Phone Number</TableCell>}
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((admin) => (
                <TableRow key={admin.id}>
                  {!isMobile && (
                    <TableCell>
                      <img src={admin.img} alt="profile" width={50} height={50} style={{ borderRadius: "50%" }} />
                    </TableCell>
                  )}
                  <TableCell>{admin.firstName}</TableCell>
                  <TableCell>{admin.company}</TableCell>
                  {!isMobile && <TableCell>{admin.phone}</TableCell>}
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      <IconButton color="primary" onClick={() => navigate("/admin2")}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => { setDeleteId(admin.id); setOpen(true); }}>
                        <Delete />
                      </IconButton>
                    </Box>
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