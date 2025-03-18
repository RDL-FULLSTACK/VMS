import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Pagination, CircularProgress
} from '@mui/material';
import Navbar from '../components/Navbar';
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const VisitorList = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null); // Ref to measure row height dynamically

  // Debounce utility to limit resize event frequency
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Function to calculate rowsPerPage based on window dimensions
  const updateRowsPerPage = useCallback(() => {
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;

    const navbarHeight = 64;
    const searchBarHeight = 80;
    const paginationHeight = 52;
    const headerHeight = 48;
    const paddingMargin = 32;

    // Measure actual row height if possible
    let rowHeight = 48; // Default fallback
    if (rowRef.current) {
      rowHeight = rowRef.current.getBoundingClientRect().height || rowHeight;
    }

    const availableHeight = windowHeight - (navbarHeight + searchBarHeight + paginationHeight + headerHeight + paddingMargin);
    let calculatedRows = Math.floor(availableHeight / rowHeight);

    const minRows = 3;
    const maxRows = 20;
    calculatedRows = Math.max(minRows, Math.min(maxRows, calculatedRows));

    if (windowWidth < 600) {
      calculatedRows = Math.min(calculatedRows, 5);
    } else if (windowWidth < 960) {
      calculatedRows = Math.min(calculatedRows, 10);
    } else if (windowWidth >= 1920) {
      calculatedRows = Math.min(calculatedRows, 15);
    }

    setRowsPerPage(calculatedRows);
  }, []);

  const debouncedUpdateRowsPerPage = debounce(updateRowsPerPage, 200);

  useEffect(() => {
    updateRowsPerPage();
    window.addEventListener("resize", debouncedUpdateRowsPerPage);

    return () => {
      window.removeEventListener("resize", debouncedUpdateRowsPerPage);
    };
  }, [updateRowsPerPage, debouncedUpdateRowsPerPage]);

  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/visitors");
        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }
        const rawData = await response.json();

        let data;
        if (Array.isArray(rawData)) {
          data = rawData;
        } else if (rawData.data && Array.isArray(rawData.data)) {
          data = rawData.data;
        } else {
          throw new Error("Unexpected data format from backend");
        }

        const currentTime = new Date();
        const currentDate = currentTime.toISOString().split('T')[0];

        const transformedVisitors = data.map(visitor => {
          const checkInTime = visitor.checkInTime ? new Date(visitor.checkInTime) : null;
          const checkOutTime = visitor.checkOutTime ? new Date(visitor.checkOutTime) : null;
          const checkInDate = checkInTime ? checkInTime.toISOString().split('T')[0] : null;

          let actualDuration = 0;
          if (checkInTime && checkInDate === currentDate) {
            actualDuration = checkOutTime
              ? checkOutTime - checkInTime
              : currentTime - checkInTime;
          }

          const expectedDurationMs = (visitor.expectedDuration?.hours || 0) * 60 * 60 * 1000 +
                                    (visitor.expectedDuration?.minutes || 0) * 60 * 1000;

          return {
            id: visitor._id,
            name: visitor.fullName || "",
            email: visitor.email || "",
            phone: visitor.phoneNumber || "",
            checkIn: checkInTime ? checkInTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "",
            checkOut: checkOutTime ? checkOutTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "",
            host: visitor.personToVisit || "",
            designation: visitor.designation || "",
            date: checkInTime ? checkInTime.toISOString().split('T')[0] : "",
            assets: visitor.assets || [],
            visitorCompany: visitor.visitorCompany || "",
            expectedDuration: visitor.expectedDuration || { hours: 0, minutes: 0 },
            actualDuration,
            isOverDuration: actualDuration > expectedDurationMs,
            checkInTimeRaw: checkInTime,
            checkOutTimeRaw: checkOutTime,
          };
        });

        setVisitors(transformedVisitors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitors();

    const interval = setInterval(() => {
      setVisitors(prevVisitors => prevVisitors.map(visitor => {
        if (!visitor.checkOutTimeRaw && visitor.checkInTimeRaw) {
          const currentTime = new Date();
          const checkInDate = new Date(visitor.checkInTimeRaw).toISOString().split('T')[0];
          const currentDate = currentTime.toISOString().split('T')[0];
          if (checkInDate === currentDate) {
            const newActualDuration = currentTime - new Date(visitor.checkInTimeRaw);
            const expectedDurationMs = (visitor.expectedDuration?.hours || 0) * 60 * 60 * 1000 +
                                      (visitor.expectedDuration?.minutes || 0) * 60 * 1000;
            return {
              ...visitor,
              actualDuration: newActualDuration,
              isOverDuration: newActualDuration > expectedDurationMs
            };
          }
        }
        return visitor;
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleViewClick = (visitor) => {
    setSelectedVisitor(visitor);
    setOpenModal(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Memoize filteredVisitors to avoid unnecessary recalculations
  const filteredVisitors = useMemo(() => {
    return visitors.filter((visitor) => {
      const matchesSearch = visitor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate = selectedDate ? visitor.date === selectedDate : true;
      return matchesSearch && matchesDate;
    });
  }, [visitors, searchTerm, selectedDate]);

  // Adjust page number when rowsPerPage changes to keep the current visitor in view
  useEffect(() => {
    const totalPages = Math.ceil(filteredVisitors.length / rowsPerPage);
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [rowsPerPage, filteredVisitors, page]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedDate]);

  const paginatedVisitors = filteredVisitors.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Recalculate rowsPerPage when the row height might change (e.g., after data loads)
  useEffect(() => {
    if (paginatedVisitors.length > 0) {
      updateRowsPerPage();
    }
  }, [paginatedVisitors, updateRowsPerPage]);

  const buttonStyles = {
    py: 0.3,
    fontSize: '0.75rem',
    minWidth: '80px',
    textAlign: 'center',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box
        sx={{
          flexGrow: 1,
          p: { xs: 1, sm: 2 },
          bgcolor: '#f5f5f5',
          mb: 1
        }}
      >
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
                      xs: 'repeat(12, minmax(100px, 1fr))',
                      sm: '40px 150px 200px 150px 100px 100px 120px 100px 100px 150px 100px 180px',
                    },
                    gap: 1,
                    bgcolor: '#e0e0e0',
                    p: 1,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    alignItems: 'center',
                    minWidth: '1390px',
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
                  <Box>Company</Box>
                  <Box>Assets</Box>
                  <Box textAlign="center">Actions</Box>
                </Box>

                {paginatedVisitors.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', py: 2 }}>
                    No visitors found.
                  </Typography>
                ) : (
                  paginatedVisitors.map((visitor, index) => (
                    <Box
                      key={visitor.id}
                      ref={index === 0 ? rowRef : null} // Attach ref to the first row to measure height
                      sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                          xs: 'repeat(12, minmax(100px, 1fr))',
                          sm: '40px 150px 200px 150px 100px 100px 120px 100px 100px 150px 100px 180px',
                        },
                        gap: 1,
                        p: 1,
                        borderBottom: '1px solid #e0e0e0',
                        alignItems: 'center',
                        minWidth: '1390px',
                        bgcolor: visitor.isOverDuration ? '#ffcccc' : 'inherit',
                      }}
                    >
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.id.slice(-4)}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.name}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.email}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.phone}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.checkIn}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.checkOut}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.host}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.designation}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.date}
                      </Box>
                      <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {visitor.visitorCompany}
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        {visitor.assets.length > 0 ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleViewClick(visitor)}
                            size="small"
                            sx={{ ...buttonStyles }}
                            aria-label={`View assets for ${visitor.name}`}
                          >
                            View
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            color="error"
                            disabled
                            size="small"
                            sx={{ ...buttonStyles }}
                            aria-label={`No assets available for ${visitor.name}`}
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
                            gap: 0.5,
                            justifyContent: 'center',
                          }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              ...buttonStyles,
                              bgcolor: 'orange',
                              color: 'white',
                              '&:hover': { bgcolor: '#e68a00' }
                            }}
                            onClick={() => navigate(`/visitorcard/${visitor.id}`)}
                            aria-label={`View visitor card for ${visitor.name}`}
                          >
                            Visitor Card
                          </Button>
                        </Box>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>

              {filteredVisitors.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Pagination
                    count={Math.ceil(filteredVisitors.length / rowsPerPage)}
                    page={page}
                    onChange={handleChangePage}
                    color="primary"
                    size="small"
                    aria-label="Visitor list pagination"
                  />
                </Box>
              )}
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
      <Footer />
    </Box>
  );
};

export default VisitorList;