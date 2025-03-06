import React, { useState } from "react";
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

// Sample Data for Charts
const chartData = [
  { name: "Jan", visits: 20 },
  { name: "Feb", visits: 40 },
  { name: "Mar", visits: 30 },
  { name: "Apr", visits: 60 },
  { name: "May", visits: 50 },
  { name: "Jun", visits: 80 },
];

const meterData = [
  { name: "Checked-In", value: 50, color: "#0088FE" },
  { name: "Checked-Out", value: 70, color: "#00C49F" },
  { name: "Pending", value: 15, color: "#FFBB28" },
];

const stats = [
  { title: "Total Visitors", value: 120, icon: <People />, color: "#673ab7" },
  { title: "Checked-In", value: 50, icon: <CheckCircle />, color: "#4caf50" },
  { title: "Checked-Out", value: 70, icon: <Cancel />, color: "#f44336" },
  { title: "Pending", value: 15, icon: <TrendingUp />, color: "#ff9800" },
  { title: "Vehicles", value: 45, icon: <DirectionsCar />, color: "#3f51b5" },
];

function Home() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
const sampleVisitors = [
  {
    id: 1,
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    company: "Tech Corp",
    phone: "123-456-7890",
    checkIn: "2025-03-06 10:00 AM",
    checkOut: "2025-03-06 05:00 PM",
  },
  {
    id: 2,
    img: "https://randomuser.me/api/portraits/women/2.jpg",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    company: "Business Ltd",
    phone: "987-654-3210",
    checkIn: "2025-03-06 09:30 AM",
    checkOut: "2025-03-06 04:30 PM",
  },
  {
    id: 3,
    img: "https://randomuser.me/api/portraits/men/3.jpg",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@example.com",
    company: "Finance Inc",
    phone: "555-123-4567",
    checkIn: "2025-03-06 11:15 AM",
    checkOut: "2025-03-06 06:00 PM",
  },
  {
    id: 4,
    img: "https://randomuser.me/api/portraits/women/4.jpg",
    firstName: "Emily",
    lastName: "Davis",
    email: "emily.davis@example.com",
    company: "Marketing Solutions",
    phone: "222-333-4444",
    checkIn: "2025-03-06 08:45 AM",
    checkOut: "2025-03-06 03:30 PM",
  },
  {
    id: 5,
    img: "https://randomuser.me/api/portraits/men/5.jpg",
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@example.com",
    company: "Consulting Group",
    phone: "777-888-9999",
    checkIn: "2025-03-06 12:00 PM",
    checkOut: "2025-03-06 07:00 PM",
  },
  {
    id: 6,
    img: "https://randomuser.me/api/portraits/women/6.jpg",
    firstName: "Sophia",
    lastName: "Taylor",
    email: "sophia.taylor@example.com",
    company: "Creative Agency",
    phone: "666-555-4444",
    checkIn: "2025-03-06 09:00 AM",
    checkOut: "2025-03-06 02:45 PM",
  },
  {
    id: 7,
    img: "https://randomuser.me/api/portraits/men/7.jpg",
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@example.com",
    company: "Engineering Ltd",
    phone: "111-222-3333",
    checkIn: "2025-03-06 10:30 AM",
    checkOut: "2025-03-06 05:45 PM",
  },
  {
    id: 8,
    img: "https://randomuser.me/api/portraits/women/8.jpg",
    firstName: "Olivia",
    lastName: "Martinez",
    email: "olivia.martinez@example.com",
    company: "Health Solutions",
    phone: "444-555-6666",
    checkIn: "2025-03-06 11:45 AM",
    checkOut: "2025-03-06 06:15 PM",
  },
  {
    id: 9,
    img: "https://randomuser.me/api/portraits/men/9.jpg",
    firstName: "William",
    lastName: "Thomas",
    email: "william.thomas@example.com",
    company: "IT Services",
    phone: "999-000-1111",
    checkIn: "2025-03-06 07:30 AM",
    checkOut: "2025-03-06 03:00 PM",
  },
  {
    id: 10,
    img: "https://randomuser.me/api/portraits/women/10.jpg",
    firstName: "Emma",
    lastName: "Garcia",
    email: "emma.garcia@example.com",
    company: "Retail Group",
    phone: "333-222-1111",
    checkIn: "2025-03-06 08:15 AM",
    checkOut: "2025-03-06 04:00 PM",
  },
];

  const [visitors, setVisitors] = useState(sampleVisitors);

  const columns = [
    {
      field: "img",
      headerName: "Image",
      width: 100,
      renderCell: (params) => (
        <Avatar src={params.value} sx={{ width: 50, height: 50 }} />
      ),
    },
    { field: "firstName", headerName: "First Name", width: 150 },
    { field: "lastName", headerName: "Last Name", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    { field: "company", headerName: "Company", width: 150 },
    { field: "phone", headerName: "Phone", width: 150 },
    { field: "checkIn", headerName: "Check-In", width: 150 },
    { field: "checkOut", headerName: "Check-Out", width: 150 },
  ];

  return (
    <>
      <Navbar />

      {/* Main Layout with Two Containers */}
      <Grid container spacing={2} mt={4} px={2}>
        {/* Left Main Container */}
        <Grid item xs={8}>
          <Container
            sx={{
              bgcolor: "#f8f9fa",
              minHeight: "auto",
              py: 3,
              px: 3,
              borderRadius: "20px",
              boxShadow: 3,
            }}
          >
            {/* Stats Cards */}
            <Grid container spacing={3} justifyContent="center">
              {stats.map((stat, index) => (
                <Grid item xs={6} sm={4} md={2} key={index}>
                  <Card
                    sx={{
                      bgcolor: stat.color,
                      color: "white",
                      textAlign: "center",
                      p: 2,
                      borderRadius: 2,
                    }}
                  >
                    <CardContent>
                      <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                      >
                        {stat.icon}
                        <Typography variant="body1">{stat.title}</Typography>
                        <Typography variant="h5">{stat.value}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Visitors Table */}
            <Box mt={4}>
              <Paper elevation={4} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
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
                  <Box sx={{ height: 400, width: "100%" }}>
                    <DataGrid rows={visitors} columns={columns} pageSize={5} />
                  </Box>
                )}
              </Paper>
            </Box>
          </Container>
        </Grid>

        {/* Right-Side Container with Charts */}
        <Grid item xs={4}>
          <Container
            sx={{
              bgcolor: "#f8f9fa",
              minHeight: "auto",
              py: 3,
              px: 3,
              borderRadius: "20px",
              boxShadow: 3,
            }}
          >
            {/* Activity Chart */}
            <Paper elevation={4} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Activity Chart
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="visits" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>

            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #f3f4f6, #ffffff)",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{ textAlign: "center", fontWeight: "bold", color: "#333" }}
              >
                Visitor Status Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={meterData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <defs>
                    <linearGradient
                      id="colorCheckedIn"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#0088FE"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorCheckedOut"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#00C49F"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorPending"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#FFBB28" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#FFBB28"
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                  <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 14 }} />
                  <YAxis tick={{ fill: "#555", fontSize: 14 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.9)",
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
