import React, { useState } from 'react';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, IconButton, Menu, MenuItem, useMediaQuery, Card, CardContent, 
  Grid, TextField, InputAdornment 
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Link } from "react-router-dom";
import Navbar from '../components/Navbar';

const VisitorList = () => {
  const visitors = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567', checkIn: '09:30 AM', checkOut: '05:30 PM', host: 'Sarah Wilson', designation: 'Vendor', date: '2025-03-01' },
    { id: 2, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 (555) 987-6543', checkIn: '10:15 AM', checkOut: '04:45 PM', host: 'Michael Brown', designation: 'Client', date: '2025-03-02' },
    { id: 3, name: 'James Wilson', email: 'james@example.com', phone: '+1 (555) 456-7890', checkIn: '11:00 AM', checkOut: '03:30 PM', host: 'Lisa Anderson', designation: 'Interview', date: '2025-03-01' }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitor, setSelectedVisitor] = useState(null);

  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleMenuOpen = (event, visitor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitor(visitor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisitor(null);
  };

  const handleEdit = () => {
    console.log("Edit visitor:", selectedVisitor);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Delete visitor:", selectedVisitor);
    handleMenuClose();
  };

  // Filtering visitors based on search input and selected date
  const filteredVisitors = visitors.filter((visitor) =>
    (searchQuery === '' || Object.values(visitor).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )) &&
    (!selectedDate || visitor.date === selectedDate.toISOString().split('T')[0])
  );

  return (
    <>
      {/* Navbar at the top */}
      <Navbar />

      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        {/* Header */}
        {/* <Paper sx={{ bgcolor: '#673AB7', color: 'white', p: 2, mb: 2, borderRadius: 1 }}>
          <Typography variant="h4" align="center">Visitor Management</Typography>
        </Paper> */}

        {/* Search Bar and Date Filter */}
        <Paper sx={{ p: 2, mb: 2, borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search visitors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Filter by Date"
                  value={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Paper>

        {/* Visitor List */}
        <Paper sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Visitor List</Typography>

          {isMobile ? (
            // Mobile View: Card-based layout
            <Grid container spacing={2}>
              {filteredVisitors.map((visitor) => (
                <Grid item xs={12} key={visitor.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="h6">{visitor.name}</Typography>
                      <Typography>Email: {visitor.email}</Typography>
                      <Typography>Phone: {visitor.phone}</Typography>
                      <Typography>Check In: {visitor.checkIn}</Typography>
                      <Typography>Check Out: {visitor.checkOut}</Typography>
                      <Typography>Host: {visitor.host}</Typography>
                      <Typography>Designation: {visitor.designation}</Typography>
                      <Typography>Date: {visitor.date}</Typography>
                      <IconButton onClick={(event) => handleMenuOpen(event, visitor)}>
                        <MoreVertIcon />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            // Desktop View: Table Layout
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Check In</TableCell>
                    <TableCell>Check Out</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Designation</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredVisitors.map((visitor) => (
                    <TableRow key={visitor.id}>
                      <TableCell>{visitor.id}</TableCell>
                      <TableCell>{visitor.name}</TableCell>
                      <TableCell>{visitor.email}</TableCell>
                      <TableCell>{visitor.phone}</TableCell>
                      <TableCell>{visitor.checkIn}</TableCell>
                      <TableCell>{visitor.checkOut}</TableCell>
                      <TableCell>{visitor.host}</TableCell>
                      <TableCell>{visitor.designation}</TableCell>
                      <TableCell>{visitor.date}</TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleMenuOpen(event, visitor)}>
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem component={Link} to="/editcheckin" onClick={handleMenuClose}>
            Edit Check-In
          </MenuItem>
          <MenuItem onClick={handleDelete}>Delete</MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default VisitorList;
