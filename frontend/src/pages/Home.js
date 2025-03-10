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
  const [vehicleCount, setVehicleCount] = useState(0); // New state for vehicle count
  const [stats, setStats] = useState([
    { title: "Total Visitors", value: 0, icon: <People />, color: "#673ab7" },
    { title: "Checked-In", value: 0, icon: <CheckCircle />, color: "#4caf50" },
    { title: "Checked-Out", value: 0, icon: <Cancel />, color: "#f44336" },
    { title: "Pending", value: 0, icon: <TrendingUp />, color: "#ff9800" },
    { title: "Vehicle Checked-In", value: 0, icon: <DirectionsCar />, color: "#3f51b5" },
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
          vehicle: visitor.vehicle ? true : false, // This field is still mapped but won't be used for the "Vehicles" card
        }));

        setVisitors(transformedVisitors);

        const totalVisitors = transformedVisitors.length;
        const checkedIn = transformedVisitors.filter(v => v.checkIn && !v.checkOut).length;
        const checkedOut = transformedVisitors.filter(v => v.checkOut).length;
        const pending = transformedVisitors.filter(v => !v.checkIn && !v.checkOut).length;

        // Fetch vehicle data from the /api/vehicles endpoint
        const vehicleResponse = await fetch("http://localhost:5000/api/vehicles");
        if (!vehicleResponse.ok) {
          throw new Error("Failed to fetch vehicle data");
        }
        const vehicleData = await vehicleResponse.json();
        const totalVehicles = Array.isArray(vehicleData) ? vehicleData.length : 0;
        setVehicleCount(totalVehicles);

        // Update stats with the new vehicle count
        setStats([
          { ...stats[0], value: totalVisitors },
          { ...stats[1], value: checkedIn },
          { ...stats[2], value: checkedOut },
          { ...stats[3], value: pending },
          { ...stats[4], value: totalVehicles }, // Use the fetched vehicle count
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