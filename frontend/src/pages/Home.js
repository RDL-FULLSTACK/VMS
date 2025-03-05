import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
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

const ScrollableTableContainer = styled(TableContainer)({
  maxHeight: "300px", // Fixed height for scroll
  overflowY: "auto",
});

const StyledTableCell = styled(TableCell)({
  fontWeight: "bold",
  textAlign: "center",
  backgroundColor: "#f5f5f5", // Background for sticky effect
  position: "sticky",
  top: 0,
  zIndex: 1,
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
  { visitorId: "101", name: "John", email: "john@gmail.com", host: "Mr. A", checkin: "10:00 am", checkout: "12:00 pm" },
  { visitorId: "102", name: "Emma", email: "emma@gmail.com", host: "Ms. B", checkin: "10:30 am", checkout: "12:30 pm" },
  { visitorId: "103", name: "Liam", email: "liam@gmail.com", host: "Mr. C", checkin: "11:00 am", checkout: "1:00 pm" },
  { visitorId: "104", name: "Olivia", email: "olivia@gmail.com", host: "Ms. D", checkin: "11:30 am", checkout: "1:30 pm" },
  { visitorId: "105", name: "Noah", email: "noah@gmail.com", host: "Mr. E", checkin: "12:00 pm", checkout: "2:00 pm" },
  { visitorId: "106", name: "Sophia", email: "sophia@gmail.com", host: "Ms. F", checkin: "12:30 pm", checkout: "2:30 pm" },
  { visitorId: "107", name: "Mason", email: "mason@gmail.com", host: "Mr. G", checkin: "1:00 pm", checkout: "3:00 pm" },
  { visitorId: "108", name: "Ava", email: "ava@gmail.com", host: "Ms. H", checkin: "1:30 pm", checkout: "3:30 pm" },
  { visitorId: "109", name: "Elijah", email: "elijah@gmail.com", host: "Mr. I", checkin: "2:00 pm", checkout: "4:00 pm" },
  { visitorId: "110", name: "Mia", email: "mia@gmail.com", host: "Ms. J", checkin: "2:30 pm", checkout: "4:30 pm" },
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
            <ScrollableTableContainer component={Paper}>
              <Table stickyHeader>
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
                      <TableCell align="center">{visitor.checkout}</TableCell>

                   
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollableTableContainer>
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
