import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  AppBar,
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

const TableChartContainer = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  gap: "16px",
  marginTop: "24px",
  width: "100%",
});

const ContentBox = styled(Paper)({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
  width: "50%",
  minHeight: "400px",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  textAlign: "center",
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
    visitorId: "123",
    name: "abc",
    email: "abc@gmail.com",
    host: "Mr. A",
    checkin: "11:30 am",
  },
  {
    visitorId: "456",
    name: "xyz",
    email: "xyz@gmail.com",
    host: "Ms. B",
    checkin: "12:00 pm",
  },
  {
    visitorId: "789",
    name: "pqr",
    email: "pqr@gmail.com",
    host: "Mr. C",
    checkin: "1:15 pm",
  },
];

function Home() {
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

        {/* Visitors Table & Activity Chart Side by Side */}
        <TableChartContainer>
          <ContentBox>
            <Typography variant="h6" gutterBottom>
              Visitors
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Visitor ID</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Host</StyledTableCell>
                    <StyledTableCell>Check-In</StyledTableCell>
                    <StyledTableCell>Check-Out</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visitors.map((visitor, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{visitor.visitorId}</TableCell>
                      <TableCell align="center">{visitor.name}</TableCell>
                      <TableCell align="center">{visitor.email}</TableCell>
                      <TableCell align="center">{visitor.host}</TableCell>
                      <TableCell align="center">{visitor.checkin}</TableCell>
                      <TableCell align="center">
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

          <ContentBox>
            <Typography variant="h6" gutterBottom>
              Activity Chart
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="visits" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </ContentBox>
        </TableChartContainer>
      </StyledContainer>
    </>
  );
}

export default Home;
