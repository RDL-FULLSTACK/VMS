import React, { useState } from 'react';
import { 
  Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, 
  IconButton, Menu, MenuItem
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Navbar from '../components/Navbar';

const VisitorList = () => {
  const visitors = [
    { id: 1, name: 'John Smith', email: 'john@example.com', phone: '+1 (555) 123-4567', checkIn: '09:30 AM', checkOut: '05:30 PM', host: 'Sarah Wilson', designation: 'Vendor', date: '2025-03-01', 
      assets: [
        { type: 'Laptop', serialNumber: 'LAP123456' },
        { type: 'Phone', serialNumber: 'PHN789012' }
      ] 
    },
    { id: 2, name: 'Emma Davis', email: 'emma@example.com', phone: '+1 (555) 987-6543', checkIn: '10:15 AM', checkOut: '04:45 PM', host: 'Michael Brown', designation: 'Client', date: '2025-03-02', 
      assets: [
        { type: 'Tablet', serialNumber: 'TAB456789' }
      ]
    },
    { id: 3, name: 'James Wilson', email: 'james@example.com', phone: '+1 (555) 456-7890', checkIn: '11:00 AM', checkOut: '03:30 PM', host: 'Lisa Anderson', designation: 'Interview', date: '2025-03-01', 
      assets: [] 
    }
  ];

  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedVisitorForMenu, setSelectedVisitorForMenu] = useState(null);

  const handleViewClick = (visitor) => {
    setSelectedVisitor(visitor);
    setOpenModal(true);
  };

  const handleMenuOpen = (event, visitor) => {
    setAnchorEl(event.currentTarget);
    setSelectedVisitorForMenu(visitor);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedVisitorForMenu(null);
  };

  return (
    <>
      <Navbar />

      <Box sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
        <Paper sx={{ p: 2, borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>Visitor List</Typography>

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
                  <TableCell>Assets Quantity</TableCell>
                  <TableCell>Assets</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {visitors.map((visitor) => (
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
                    <TableCell align="center" style={{ verticalAlign: "middle" }}>
                      {visitor.assets.length}
                    </TableCell>

                    <TableCell>
                      {visitor.assets.length > 0 ? (
                        <Button 
                          variant="contained" 
                          color="primary" 
                          onClick={() => handleViewClick(visitor)}
                        >
                          View
                        </Button>
                      ) : (
                        <Button 
                          variant="contained" 
                          color="error"
                          disabled
                        >
                          No Assets
                        </Button>
                      )}
                    </TableCell>
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
        </Paper>

        {/* Modal for Asset Details */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Asset Details</DialogTitle>
          <DialogContent>
            {selectedVisitor && selectedVisitor.assets.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Type</strong></TableCell>
                      <TableCell><strong>Serial Number</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedVisitor.assets.map((asset, index) => (
                      <TableRow key={index}>
                        <TableCell>{asset.type}</TableCell>
                        <TableCell>{asset.serialNumber}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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

        {/* Three Dots Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleMenuClose}>Edit Check-In</MenuItem>
          <MenuItem onClick={handleMenuClose}>Visitor Card</MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ color: 'red' }}>Delete</MenuItem>
        </Menu>
      </Box>
    </>
  );
};

export default VisitorList;
