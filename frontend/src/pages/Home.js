import React, { useState, useEffect, useCallback } from "react";
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
  Tabs,
  Tab,
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

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

function Home() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [vehicles, setVehicles] = useState([]); // State for vehicle list
  const [chartData, setChartData] = useState([]);
  const [meterData, setMeterData] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // State for tab selection

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

  // Function to get the current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // e.g., "2025-03-10"
  };

  // Helper function to validate and format a date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    let date;
    if (dateString.includes("/")) {
      date = new Date(dateString.replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"));
    } else if (dateString.includes("-")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string: ${dateString}`);
      return "N/A";
    }
    return date.toLocaleString();
  };

  // Helper function to extract YYYY-MM-DD from a date string
  const extractDateOnly = (dateString) => {
    if (!dateString) return null;
    let date;
    if (dateString.includes("/")) {
      date = new Date(dateString.replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2"));
    } else if (dateString.includes("-")) {
      date = new Date(dateString);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) {
      return null;
    }
    return date.toISOString().split("T")[0];
  };

  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);
      const currentDate = getCurrentDate();
      console.log("Current date for filtering:", currentDate);

      // Fetch visitors data
      const visitorResponse = await fetch("http://localhost:5000/api/visitors");
      if (!visitorResponse.ok) {
        throw new Error("Failed to fetch visitor data");
      }
      const rawVisitorData = await visitorResponse.json();
      console.log("Raw visitor response data:", rawVisitorData);

      let visitorData;
      if (Array.isArray(rawVisitorData)) {
        visitorData = rawVisitorData;
      } else if (rawVisitorData.data && Array.isArray(rawVisitorData.data)) {
        visitorData = rawVisitorData.data;
      } else {
        throw new Error("Unexpected visitor data format from backend");
      }

      // Filter visitors for the current date
      const filteredVisitors = visitorData.filter(visitor => {
        const checkInDate = visitor.checkInTime
          ? extractDateOnly(visitor.checkInTime)
          : null;
        return checkInDate && checkInDate === currentDate;
      });

      const transformedVisitors = filteredVisitors.map(visitor => ({
        id: visitor._id,
        img: visitor.photo || "https://randomuser.me/api/portraits/men/1.jpg",
        firstName: visitor.fullName ? visitor.fullName.split(" ")[0] : "",
        lastName: visitor.fullName ? visitor.fullName.split(" ")[1] || "" : "",
        email: visitor.email || "",
        company: visitor.visitorCompany || "",
        phone: visitor.phoneNumber || "",
        checkIn: formatDate(visitor.checkInTime),
        checkOut: formatDate(visitor.checkOutTime),
        reasonForVisit: visitor.reasonForVisit || "",
        personToVisit: visitor.personToVisit || "",
        designation: visitor.designation || "",
        vehicle: visitor.vehicle || false,
      }));

      setVisitors(transformedVisitors);

      const checkedIn = transformedVisitors.filter(v => v.checkIn !== "N/A" && v.checkOut === "N/A").length;
      const checkedOut = transformedVisitors.filter(v => v.checkOut !== "N/A").length;
      const pending = transformedVisitors.filter(v => v.checkIn === "N/A" && v.checkOut === "N/A").length;
      const totalVisitors = checkedIn + checkedOut;

      // Fetch vehicle data
      const vehicleResponse = await fetch("http://localhost:5000/api/vehicles");
      if (!vehicleResponse.ok) {
        throw new Error("Failed to fetch vehicle data");
      }
      const vehicleData = await vehicleResponse.json();
      console.log("Raw vehicle response data:", vehicleData);

      // Filter vehicles for the current date and checked-in status
      const currentDateVehicles = Array.isArray(vehicleData)
        ? vehicleData.filter(vehicle => {
            const vehicleDate = vehicle.date ? vehicle.date : null;
            const isCheckedIn = vehicle.checkInTime && (!vehicle.checkOutTime || vehicle.checkOutTime === "");
            const matchesCurrentDate = vehicleDate === currentDate;
            console.log(`Vehicle:`, vehicle, `date: ${vehicle.date}`, `Matches Current Date: ${matchesCurrentDate}`, `Is Checked In: ${isCheckedIn}`);
            return matchesCurrentDate && isCheckedIn;
          })
        : [];
      const totalVehicles = currentDateVehicles.length;

      // Transform vehicle data for DataGrid
      const transformedVehicles = currentDateVehicles.map(vehicle => ({
        id: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber || "N/A",
        purpose: vehicle.purpose || "N/A",
        date: vehicle.date || "N/A",
        checkInTime: vehicle.checkInTime || "N/A",
        checkOutTime: vehicle.checkOutTime || "N/A",
      }));

      setVehicles(transformedVehicles);
      console.log("Transformed vehicles:", transformedVehicles);

      // Use functional update to avoid dependency on 'stats'
      setStats(prevStats => [
        { ...prevStats[0], value: totalVisitors },
        { ...prevStats[1], value: checkedIn },
        { ...prevStats[2], value: checkedOut },
        { ...prevStats[3], value: pending },
        { ...prevStats[4], value: totalVehicles },
      ]);

      setMeterData([
        { name: "Checked-In", value: checkedIn, color: "#0088FE" },
        { name: "Checked-Out", value: checkedOut, color: "#00C49F" },
        { name: "Pending", value: pending, color: "#FFBB28" },
      ]);

      // Update chart data (daily visits for the current day)
      const dailyVisits = transformedVisitors.reduce((acc, visitor) => {
        if (visitor.checkIn !== "N/A") {
          const date = new Date(visitor.checkIn);
          const day = date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
          acc[day] = (acc[day] || 0) + 1;
        }
        return acc;
      }, {});
      setChartData(Object.entries(dailyVisits).map(([name, visits]) => ({
        name,
        visits,
      })));

    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array since no external dependencies

  useEffect(() => {
    // Initial fetch
    fetchVisitors();

    // Polling every minute to keep the dashboard updated
    const pollingInterval = setInterval(fetchVisitors, 60000);

    // Reset at midnight
    const checkDayChange = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // Set to next midnight
      const timeUntilMidnight = midnight - now;

      const timeoutId = setTimeout(() => {
        fetchVisitors(); // Re-fetch data at midnight
        checkDayChange(); // Schedule the next reset
      }, timeUntilMidnight);

      return () => clearTimeout(timeoutId);
    };
    checkDayChange();

    // Cleanup on unmount
    return () => {
      clearInterval(pollingInterval);
      checkDayChange();
    };
  }, [fetchVisitors]);

  const visitorColumns = [
    {
      field: "id",
      headerName: "ID",
      width: isMobile ? 70 : 100,
      renderCell: (params) => params.value.slice(-4),
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
    { field: "vehicle", headerName: "Vehicle", flex: isMobile ? 0 : 1, width: isMobile ? 80 : undefined, hide: isTablet },
  ];

  const vehicleColumns = [
    { field: "id", headerName: "ID", width: isMobile ? 70 : 100, renderCell: (params) => params.value.slice(-4) },
    { field: "vehicleNumber", headerName: "Vehicle Number", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    { field: "purpose", headerName: "Purpose", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    { field: "date", headerName: "Date", flex: isMobile ? 0 : 1, width: isMobile ? 100 : undefined },
    { field: "checkInTime", headerName: "Check-In Time", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
    // Removed: { field: "checkOutTime", headerName: "Check-Out Time", flex: isMobile ? 0 : 1, width: isMobile ? 120 : undefined },
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

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
                      <Box display="flex" flexDirection="column" alignItems="center">
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
                <Tabs value={activeTab} onChange={handleTabChange} centered>
                  <Tab label="Visitors" id="tab-0" aria-controls="tabpanel-0" />
                  <Tab label="Vehicles" id="tab-1" aria-controls="tabpanel-1" />
                </Tabs>
                <TabPanel value={activeTab} index={0}>
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
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
                        columns={visitorColumns}
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
                </TabPanel>
                <TabPanel value={activeTab} index={1}>
                  {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
                      <CircularProgress />
                    </Box>
                  ) : error ? (
                    <Typography variant="body1" color="error" align="center">
                      {error}
                    </Typography>
                  ) : (
                    <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
                      <DataGrid
                        rows={vehicles}
                        columns={vehicleColumns}
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
                </TabPanel>
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