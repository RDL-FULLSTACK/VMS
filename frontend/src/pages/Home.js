// 
import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  TrendingUp,
  People,
  CheckCircle,
  Cancel,
  DirectionsCar,
  MoreVert,
} from "@mui/icons-material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import Footer from "../components/Footer";

// Custom TabPanel component
function TabPanel(props) {
  const { children, value, index, date, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body2"
            align="right"
            sx={{ mb: 1, color: "#555" }}
          >
            {date}
          </Typography>
          {children}
        </Box>
      )}
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visitors, setVisitors] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [meterData, setMeterData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [currentDate, setCurrentDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorId, setSelectedVisitorId] = useState(null);

  const [stats, setStats] = useState([
    { title: "Total Visitors", value: 0, icon: <People />, color: "#673ab7" },
    { title: "Checked-In", value: 0, icon: <CheckCircle />, color: "#4caf50" },
    { title: "Checked-Out", value: 0, icon: <Cancel />, color: "#f44336" },
    { title: "Pending", value: 0, icon: <TrendingUp />, color: "#ff9800" },
    {
      title: "Vehicle Checked-In",
      value: 0,
      icon: <DirectionsCar />,
      color: "#3f51b5",
    },
  ]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  const fetchVisitors = useCallback(async () => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];

    const formatTimeOnly = (timeString) => {
      if (!timeString) return "N/A";
      const timeRegex = /^(\d{1,2}:\d{2}\s?(AM|PM))$/i;
      if (timeRegex.test(timeString.trim())) {
        return timeString.trim();
      }
      let date = new Date(timeString);
      if (isNaN(date.getTime())) {
        console.warn(`Invalid time string: ${timeString}`);
        return "N/A";
      }
      return date.toLocaleTimeString();
    };

    const extractDateOnly = (dateString) => {
      if (!dateString) return null;
      let date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      return date.toISOString().split("T")[0];
    };

    const getDateRange = (days) => {
      const dates = [];
      const today = new Date(getCurrentDate());
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(date.toISOString().split("T")[0]);
      }
      return dates;
    };

    try {
      setLoading(true);
      const currentDateIso = getCurrentDate();
      const formattedCurrentDate = new Date(currentDateIso).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
      );
      setCurrentDate(formattedCurrentDate);

      const visitorResponse = await fetch("http://localhost:5000/api/visitors");
      if (!visitorResponse.ok) throw new Error("Failed to fetch visitor data");
      const rawVisitorData = await visitorResponse.json();
      const visitorData = Array.isArray(rawVisitorData)
        ? rawVisitorData
        : rawVisitorData.data || [];
      if (!Array.isArray(visitorData))
        throw new Error("Unexpected visitor data format");

      const filteredVisitors = visitorData.filter((visitor) => {
        const checkInDate = extractDateOnly(visitor.checkInTime);
        return checkInDate === currentDateIso;
      });

      const transformedVisitors = filteredVisitors.map((visitor) => ({
        id: visitor._id,
        img: visitor.photoUrl,
        firstName: visitor.fullName?.split(" ")[0] || "",
        lastName: visitor.fullName?.split(" ")[1] || "",
        email: visitor.email || "",
        company: visitor.visitorCompany || "",
        phone: visitor.phoneNumber || "",
        checkIn: formatTimeOnly(visitor.checkInTime),
        checkOut: formatTimeOnly(visitor.checkOutTime),
        reasonForVisit: visitor.reasonForVisit || "",
        personToVisit: visitor.personToVisit || "",
        designation: visitor.designation || "",
        vehicle: visitor.vehicle || false,
      }));

      setVisitors(transformedVisitors);

      const checkedIn = transformedVisitors.filter(
        (v) => v.checkIn !== "N/A" && v.checkOut === "N/A"
      ).length;
      const checkedOut = transformedVisitors.filter(
        (v) => v.checkOut !== "N/A"
      ).length;

      const prescheduleResponse = await fetch(
        "http://localhost:5000/api/preschedules"
      );
      if (!prescheduleResponse.ok)
        throw new Error("Failed to fetch preschedule data");
      const rawPrescheduleData = await prescheduleResponse.json();
      const prescheduleData = Array.isArray(rawPrescheduleData)
        ? rawPrescheduleData
        : rawPrescheduleData.data || [];
      if (!Array.isArray(prescheduleData))
        throw new Error("Unexpected preschedule data format");

      const pending = prescheduleData.filter((preschedule) => {
        const isPending = preschedule.status?.toLowerCase() === "pending";
        return isPending;
      }).length;

      const totalVisitors = checkedIn + checkedOut;

      const vehicleResponse = await fetch("http://localhost:5000/api/vehicles");
      if (!vehicleResponse.ok) throw new Error("Failed to fetch vehicle data");
      const vehicleData = await vehicleResponse.json();

      const currentDateVehicles = (
        Array.isArray(vehicleData) ? vehicleData : []
      ).filter((vehicle) => {
        const vehicleDate = extractDateOnly(vehicle.date);
        return vehicleDate === currentDateIso;
      });

      const transformedVehicles = currentDateVehicles.map((vehicle) => ({
        id: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber || "N/A",
        purpose: vehicle.purpose || "N/A",
        date: vehicle.date || "N/A",
        checkInTime: formatTimeOnly(vehicle.checkInTime),
        checkOutTime: formatTimeOnly(vehicle.checkOutTime),
      }));

      setVehicles(transformedVehicles);

      const vehicleCheckedIn = currentDateVehicles.filter(
        (vehicle) => vehicle.checkInTime && !vehicle.checkOutTime
      ).length;

      setStats((prevStats) => [
        { ...prevStats[0], value: totalVisitors },
        { ...prevStats[1], value: checkedIn },
        { ...prevStats[2], value: checkedOut },
        { ...prevStats[3], value: pending },
        { ...prevStats[4], value: vehicleCheckedIn },
      ]);

      const updatedMeterData = [
        { name: "Checked-In", value: checkedIn || 0, color: "#0088FE" },
        { name: "Checked-Out", value: checkedOut || 0, color: "#00C49F" },
        { name: "Pending", value: pending || 0, color: "#FFBB28" },
      ];
      setMeterData(updatedMeterData);

      const dateRange = getDateRange(7);
      const dailyVisits = visitorData.reduce((acc, visitor) => {
        const checkInDate = extractDateOnly(visitor.checkInTime);
        if (checkInDate && dateRange.includes(checkInDate)) {
          acc[checkInDate] = (acc[checkInDate] || 0) + 1;
        }
        return acc;
      }, {});
      setChartData(
        dateRange.map((date) => ({
          name: new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
          }),
          visits: dailyVisits[date] || 0,
        }))
      );
    } catch (err) {
      setError(err.message);
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();

    const pollingInterval = setInterval(fetchVisitors, 60000);
    let midnightTimeout;

    const checkDayChange = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const timeUntilMidnight = midnight - now;

      midnightTimeout = setTimeout(() => {
        fetchVisitors();
        checkDayChange();
      }, timeUntilMidnight);
    };
    checkDayChange();

    return () => {
      clearInterval(pollingInterval);
      clearTimeout(midnightTimeout);
    };
  }, [fetchVisitors]);

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitorId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisitorId(null);
  };

  const handleEditCheckIn = (visitorId) => {
    navigate(`/editcheckin/${visitorId}`);
  };

  const handleDelete = async () => {
    if (!selectedVisitorId) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/visitors/${selectedVisitorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete visitor");

      setVisitors((prevVisitors) =>
        prevVisitors.filter((visitor) => visitor.id !== selectedVisitorId)
      );

      const checkedIn = visitors.filter(
        (v) => v.checkIn !== "N/A" && v.checkOut === "N/A"
      ).length;
      const checkedOut = visitors.filter((v) => v.checkOut !== "N/A").length;
      const totalVisitors = checkedIn + checkedOut;

      setStats((prevStats) => [
        { ...prevStats[0], value: totalVisitors },
        { ...prevStats[1], value: checkedIn },
        { ...prevStats[2], value: checkedOut },
        prevStats[3],
        prevStats[4],
      ]);

      setMeterData((prevMeterData) => [
        { ...prevMeterData[0], value: checkedIn },
        { ...prevMeterData[1], value: checkedOut },
        prevMeterData[2],
      ]);
    } catch (err) {
      console.error("Error deleting visitor:", err);
      setError(err.message);
    } finally {
      handleMenuClose();
    }
  };

  const visitorColumns = [
    {
      field: "img",
      headerName: "Image",
      width: isMobile ? 70 : 100,
      renderCell: (params) => (
        <Avatar
          src={params.value}
          sx={{ width: isMobile ? 40 : 50, height: isMobile ? 40 : 50 }}
        />
      ),
    },
    {
      field: "firstName",
      headerName: "Name",
      flex: 1,
      minWidth: isMobile ? 100 : 120,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
      minWidth: 150,
      hideable: isMobile,
    },
    { field: "company", headerName: "Company", flex: 1, minWidth: 120 },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1,
      minWidth: 120,
      hideable: isTablet,
    },
    { field: "checkIn", headerName: "Check-In", flex: 1, minWidth: 120 },
    {
      field: "checkOut",
      headerName: "Check-Out",
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (params.value !== "N/A" ? params.value : ""),
    },
    {
      field: "reasonForVisit",
      headerName: "Purpose",
      flex: 1,
      minWidth: 120,
      hideable: isTablet,
    },
    {
      field: "personToVisit",
      headerName: "Host",
      flex: 1,
      minWidth: 120,
      hideable: isTablet,
    },
    {
      field: "designation",
      headerName: "Designation",
      flex: 1,
      minWidth: 120,
      hideable: isTablet,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="more"
            aria-controls={`menu-${params.row.id}`}
            aria-haspopup="true"
            onClick={(event) => handleMenuClick(event, params.row.id)}
          >
            <MoreVert />
          </IconButton>
          <Menu
            id={`menu-${params.row.id}`}
            anchorEl={anchorEl}
            open={Boolean(anchorEl) && selectedVisitorId === params.row.id}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => handleEditCheckIn(selectedVisitorId)}>
              Edit
            </MenuItem>
            <MenuItem
            onClick={handleDelete}
            sx={{
              color: "red", // Sets the text color to red
              "&:hover": {
                backgroundColor: "#ffebee", // Light red background on hover for better UX
              },
            }}
          >
            Delete
          </MenuItem>
          </Menu>
        </>
      ),
    },
  ];

  const vehicleColumns = [
    {
      field: "vehicleNumber",
      headerName: "Vehicle Number",
      flex: 1,
      minWidth: 120,
    },
    { field: "purpose", headerName: "Purpose", flex: 1, minWidth: 120 },
    { field: "date", headerName: "Date", flex: 1, minWidth: 100 },
    {
      field: "checkInTime",
      headerName: "Check-In Time",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "checkOutTime",
      headerName: "Check-Out Time",
      flex: 1,
      minWidth: 120,
      hideable: isMobile,
    },
  ];

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  return (
    <>
      <Navbar />
      <Grid
        container
        spacing={isMobile ? 1 : 2}
        mt={isMobile ? 1 : 2}
        px={isMobile ? 1 : 2}
      >
        <Grid item xs={12} md={8}>
          <Container
            sx={{
              bgcolor: "#f8f9fa",
              py: isMobile ? 2 : 3,
              px: isMobile ? 2 : 3,
              borderRadius: "20px",
              boxShadow: 3,
              mb: isMobile ? 2 : 3,
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
                        <Typography
                          variant={isMobile ? "body2" : "body1"}
                          sx={{ fontSize: isMobile ? "0.8rem" : "1rem" }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography
                          variant={isMobile ? "h6" : "h5"}
                          sx={{ fontSize: isMobile ? "1.2rem" : "1.5rem" }}
                        >
                          {stat.value}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>

          <Container
            sx={{
              bgcolor: "#f8f9fa",
              py: isMobile ? 2 : 3,
              px: isMobile ? 2 : 3,
              borderRadius: "20px",
              boxShadow: 3,
              height: isMobile ? "auto" : "600px",
            }}
          >
            <Paper elevation={4} sx={{ p: isMobile ? 2 : 3, borderRadius: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Visitors" id="tab-0" aria-controls="tabpanel-0" />
                <Tab label="Vehicles" id="tab-1" aria-controls="tabpanel-1" />
              </Tabs>
              <TabPanel value={activeTab} index={0} date={currentDate}>
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
                  <DataGrid
                    rows={visitors}
                    columns={visitorColumns}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableColumnMenu
                    pageSizeOptions={[5]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: isMobile ? 5 : 5 },
                      },
                    }}
                  />
                )}
              </TabPanel>
              <TabPanel value={activeTab} index={1} date={currentDate}>
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
                  <DataGrid
                    rows={vehicles}
                    columns={vehicleColumns}
                    getRowId={(row) => row.id}
                    autoHeight
                    disableColumnMenu
                    pageSizeOptions={[5]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: isMobile ? 5 : 5 },
                      },
                    }}
                  />
                )}
              </TabPanel>
            </Paper>
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
            <Paper
              elevation={4}
              sx={{ p: isMobile ? 2 : 3, borderRadius: 2, mb: 3 }}
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
                <PieChart>
                  <Pie
                    data={meterData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={isMobile ? 80 : 100}
                    label={({ name, value }) => `${name}: ${value}`}
                    labelLine={true}
                    paddingAngle={2}
                  >
                    {meterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: isMobile ? 12 : 14,
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value, name) => [`${value}`, name]}
                  />
                </PieChart>
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
                Weekly Visitors Insights
              </Typography>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={isMobile ? 200 : 250}>
                  <BarChart
                    data={chartData}
                    margin={{
                      top: 20,
                      right: isMobile ? 10 : 20,
                      left: 0,
                      bottom: 40, // Increased bottom margin to accommodate rotated labels
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#555", fontSize: isMobile ? 10 : 12, angle: -45 }} // Rotate labels by -45 degrees
                      textAnchor="end" // Align text to the end for rotated labels
                      interval={0} // Show all ticks (no skipping)
                      height={60} // Increase height to accommodate rotated labels
                    />
                    <YAxis
                      tick={{ fill: "#555", fontSize: isMobile ? 10 : 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        fontSize: isMobile ? 12 : 14,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: "8px",
                        border: "1px solid #ddd",
                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Bar dataKey="visits" fill="#8884d8" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Typography align="center" color="textSecondary">
                  No data available for Weekly Visitors Insights
                </Typography>
              )}
            </Paper>
          </Container>
        </Grid>
      </Grid>
      <Footer/>
    </>
  );
}

export default Home;