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
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CheckCircle } from "lucide-react";
import { styled } from "@mui/system"; // Import styled-components for CSS-in-JS
import { useNavigate } from "react-router-dom";
import Checkout from "./checkout" ;
import Checkin from "./checkin";
// Styled Components for CSS
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

const DashboardTitle = styled(Typography)({
  marginTop: "24px",
});

const StatsContainer = styled(Grid)({
  marginTop: "24px",
});

const StatsCard = styled(Paper)({
  padding: "16px",
  textAlign: "center",
  color: "white",
  borderRadius: "8px",
  "&:first-child": {
    backgroundColor: "#673ab7 !important",
  },
  "&:not(:first-child)": {
    backgroundColor: "#1e88e5",
  },
});

const MainContent = styled("div")({
  display: "flex",
  gap: "24px",
  marginTop: "40px",
});

const Section = styled("div")({
  flex: 1,
});

const TableContainerStyled = styled(TableContainer)({
  padding: "16px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  minHeight: "350px",
});

const ChartContainer = styled(Paper)({
  padding: "16px",
  backgroundColor: "white",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  minHeight: "350px",
});

const ChartTitle = styled(Typography)({
  color: "black",
  marginBottom: "8px",
});

const data = [
  { name: "Jan", visits: 20 },
  { name: "Feb", visits: 40 },
  { name: "Mar", visits: 30 },
  { name: "Apr", visits: 60 },
  { name: "May", visits: 50 },
  { name: "Jun", visits: 80 },
];

const visitors = [
  {
    name: "abc",
    email: "abc@gmail.com",
    visitorId: "123",
    host: "Mr. A",
    checkin: "11:30 am",
  },
  {
    name: "xyz",
    email: "xyz@gmail.com",
    visitorId: "456",
    host: "Ms. B",
    checkin: "12:00 pm",
  },
  {
    name: "pqr",
    email: "pqr@gmail.com",
    visitorId: "789",
    host: "Mr. C",
    checkin: "1:15 pm",
  },
];



function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <StyledAppBar position="static">
        <ToolbarStyled>
          <Typography variant="h6">Visitor Management System</Typography>
          <NavLinks>
            <Button color="inherit" onClick={() => navigate("/")}>
             <h3> Dashboard</h3>
            </Button>
            <Button color="inherit" onClick={() => navigate("/Checkin")}>
              Check-In
            </Button>
            <Button color="inherit" onClick={() => navigate("/pre-scheduling")}>
              Pre-Scheduling
            </Button>
            <Button color="inherit" onClick={() => navigate("/checkout")}>
              Check-Out
            </Button>
            <Button color="inherit" onClick={() => setOpen(true)}>
              Receptionist
            </Button>
          </NavLinks>
        </ToolbarStyled>
      </StyledAppBar>

      <StyledContainer maxWidth="lg">
        <DashboardTitle variant="h4">Dashboard</DashboardTitle>

        <StatsContainer container spacing={3}>
          {[
            "Total Visitors",
            "Checked-In Visitors",
            "Checked-Out Visitors",
            "Pending Approvals",
            "Total Vehicles",
          ].map((title, index) => (
            <Grid item xs={12} sm={6} md={2} key={index}>
              <StatsCard>
                <Typography variant="body1">{title}</Typography>
                <Typography variant="h5">
                  {[120, 50, 70, 15, 45][index]}
                </Typography>
              </StatsCard>
            </Grid>
          ))}
        </StatsContainer>

        <MainContent>
          <Section>
            <Typography variant="h5" style={{ marginBottom: "8px" }}>
              Visitors
            </Typography>
            <TableContainerStyled component={Paper}>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: "#eee" }}>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Visitor ID</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Check-In</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.email}</TableCell>
                      <TableCell>{visitor.visitorId}</TableCell>
                      <TableCell>{visitor.host}</TableCell>
                      <TableCell>{visitor.checkin}</TableCell>
                      <TableCell>
                        <IconButton color="success">
                          <CheckCircle />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainerStyled>
          </Section>

          <Section>
            <ChartTitle variant="h6">Activity Chart</ChartTitle>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </Section>
        </MainContent>
      </StyledContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Receptionist Profile</DialogTitle>
        <DialogContent>
          <Typography>Name: John Doe</Typography>
          <Typography>Email: johndoe@example.com</Typography>
          <Typography>Phone: 123-456-7890</Typography>
          <Typography>Address: 123 Main St, City, Country</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Home;
