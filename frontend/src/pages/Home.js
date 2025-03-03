import React, { useState } from "react";
import Navbar from "../components/Navbar";
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
import { styled } from "@mui/system";

const StyledContainer = styled(Container)({
  backgroundColor: "#fbf6f6",
  minHeight: "100vh",
  padding: "16px",
});

const StyledAppBar = styled(AppBar)({
  backgroundColor: "#673ab7 !important",
  width: "100%",
});

const StatsCard = styled(Paper)({
  padding: "16px",
  textAlign: "center",
  color: "white",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "120px",
});

const TableChartContainer = styled(Grid)({
  marginTop: "24px",
  display: "flex",
  justifyContent: "center",
});

const ContentBox = styled(Paper)({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  minHeight: "350px",
  width: "100%",
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
  { name: "abc", email: "abc@gmail.com", visitorId: "123", host: "Mr. A", checkin: "11:30 am" },
  { name: "xyz", email: "xyz@gmail.com", visitorId: "456", host: "Ms. B", checkin: "12:00 pm" },
  { name: "pqr", email: "pqr@gmail.com", visitorId: "789", host: "Mr. C", checkin: "1:15 pm" },
];

function Home() {
  const [open, setOpen] = useState(false);

  return (
    <>
   <Navbar />
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={2} justifyContent="center">
        {["Total Visitors", "Checked-In", "Checked-Out", "Pending", "Vehicles"].map((title, index) => (
          <Grid item xs={6} sm={4} md={2} key={index}>
            <StatsCard style={{ backgroundColor: "#673ab7" }}>
              <Typography variant="body1">{title}</Typography>
              <Typography variant="h5">{[120, 50, 70, 15, 45][index]}</Typography>
            </StatsCard>
          </Grid>
        ))}
      </Grid>

      <TableChartContainer container spacing={2}>
        <Grid item xs={12} md={6}>
          <ContentBox>
            <Typography variant="h6" gutterBottom>
              Visitors
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
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
            </TableContainer>
          </ContentBox>
        </Grid>

        <Grid item xs={12} md={6}>
          <ContentBox>
            <Typography variant="h6" gutterBottom>
              Activity Chart
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ContentBox>
        </Grid>
      </TableChartContainer>
    </StyledContainer>
    </>
  );
  
}

export default Home;