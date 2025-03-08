




//added responsiveness

import React, { useState, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Pagination, CircularProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";

const VisitorList = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          name: visitor.fullName || "",
          email: visitor.email || "",
          phone: visitor.phoneNumber || "",
          checkIn: visitor.checkInTime ? new Date(visitor.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : visitor.time || "",
          checkOut: visitor.checkOutTime ? new Date(visitor.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "",
          host: visitor.personToVisit || "",
          designation: visitor.designation || "",
          date: visitor.checkInTime ? new Date(visitor.checkInTime).toISOString().split('T')[0] : visitor.date || "",
          assets: visitor.assets || [],
        }));

        setVisitors(transformedVisitors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();
  }, []);

  const handleViewClick = (visitor) => {
    setSelectedVisitor(visitor);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const filteredVisitors = visitors.filter((visitor) => {
    const matchesSearch = `${visitor.name} ${visitor.email} ${visitor.phone} ${visitor.host} ${visitor.designation}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate = selectedDate ? visitor.date === selectedDate : true;
    return matchesSearch && matchesDate;
  });

  const paginatedVisitors = filteredVisitors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <>
      <Navbar />
      <Box sx={{ p: { xs: 1, sm: 2 }, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Paper sx={{ p: { xs: 1, sm: 2 }, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Visitor List</Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error" sx={{ textAlign: 'center', py: 2 }}>
              {error}
            </Typography>
          ) : (
            <>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2, 
                  mb: 2 
                }}
              >
                <TextField
                  label="Search Visitor"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <TextField
                  label="Filter by Date"
                  type="date"
                  variant="outlined"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  sx={{ minWidth: { xs: 'auto', sm: 150 } }}
                />
              </Box>

              <Box sx={{ overflowX: 'auto' }}>
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: 'repeat(11, minmax(100px, 1fr))', // Minimum width for mobile
                      sm: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
                    },
                    gap: 1,
                    bgcolor: '#e0e0e0',
                    p: 1,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    minWidth: '800px', // Ensure horizontal scrolling on small screens
                  }}
                >
                  <Box>ID</Box>
                  <Box>Name</Box>
                  <Box>Email</Box>
                  <Box>Phone Number</Box>
                  <Box>Check In</Box>
                  <Box>Check Out</Box>
                  <Box>Host</Box>
                  <Box>Designation</Box>
                  <Box>Date</Box>
                  <Box>Assets</Box>
                  <Box textAlign="center">Actions</Box>
                </Box>

                {paginatedVisitors.map((visitor) => (
                  <Box
                    key={visitor.id}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(11, minmax(100px, 1fr))',
                        sm: '40px 1.5fr 2fr 1.5fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1.5fr',
                      },
                      gap: 1,
                      p: 1,
                      borderBottom: '1px solid #e0e0e0',
                      alignItems: 'center',
                      minWidth: '800px',
                    }}
                  >
                    <Box>{visitor.id.slice(-4)}</Box>
                    <Box>{visitor.name}</Box>
                    <Box>{visitor.email}</Box>
                    <Box>{visitor.phone}</Box>
                    <Box>{visitor.checkIn}</Box>
                    <Box>{visitor.checkOut}</Box>
                    <Box>{visitor.host}</Box>
                    <Box>{visitor.designation}</Box>
                    <Box>{visitor.date}</Box>
                    <Box>
                      {visitor.assets.length > 0 ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleViewClick(visitor)}
                          size="small"
                          sx={{ py: 0.2, fontSize: '0.7rem' }}
                        >
                          View
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="error"
                          disabled
                          size="small"
                          sx={{ py: 0.2, fontSize: '0.7rem', minWidth: 'auto' }}
                        >
                          No Assets
                        </Button>
                      )}
                    </Box>
                    <Box>
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', sm: 'row' }, 
                          gap: 0.5 
                        }}
                      >
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ 
                            py: 0.3,
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            bgcolor: 'green',
                            color: 'white',
                            '&:hover': { bgcolor: 'darkgreen' }
                          }}
                          onClick={() => navigate(`/editcheckin/${visitor.id}`)}
                        >
                          Edit Check-In
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          sx={{ 
                            py: 0.3,
                            fontSize: '0.75rem',
                            minWidth: 'auto',
                            bgcolor: 'orange',
                            color: 'white',
                            '&:hover': { bgcolor: '#e68a00' }
                          }}
                          onClick={() => navigate(`/visitorcard/${visitor.id}`)}  //has to change or add this in app.js for specific routing
                        >
                          Visitor Card
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Pagination
                  count={Math.ceil(filteredVisitors.length / rowsPerPage)}
                  page={page}
                  onChange={handleChangePage}
                  color="primary"
                  size="small"
                />
              </Box>
            </>
          )}
        </Paper>

        <Dialog 
          open={openModal} 
          onClose={() => setOpenModal(false)} 
          fullWidth 
          maxWidth="sm"
          sx={{ '& .MuiDialog-paper': { width: { xs: '90%', sm: 'auto' } } }}
        >
          <DialogTitle>Asset Details</DialogTitle>
          <DialogContent>
            {selectedVisitor && selectedVisitor.assets.length > 0 ? (
              <Box 
                sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 1, 
                  mt: 2 
                }}
              >
                <Typography variant="subtitle1"><strong>Type</strong></Typography>
                <Typography variant="subtitle1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                  <strong>Serial Number</strong>
                </Typography>
                {selectedVisitor.assets.map((asset, index) => (
                  <React.Fragment key={index}>
                    <Box>{asset.type}</Box>
                    <Box>{asset.serialNumber}</Box>
                  </React.Fragment>
                ))}
              </Box>
            ) : (
              <Typography color="error" sx={{ textAlign: 'center', mt: 2 }}>
                No assets available
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenModal(false)} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default VisitorList;