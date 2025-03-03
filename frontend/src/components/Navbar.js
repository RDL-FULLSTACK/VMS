import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar"; // Import Sidebar Component

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)"); // Detect mobile view

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Check-In", path: "/checkin" },
    { label: "Pre-Scheduling", path: "/pre-scheduling" },
    { label: "Check-Out", path: "/checkout" },
    { label: "Receptionist", path: "/receptionist" },
    { label: "Admin", path: "/admin" },
  ];

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#5a3d91" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
         
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Visitor Management System
          </Typography>

          {/* Mobile View: Hamburger Menu */}
          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            /* Desktop View: Navigation Links */
            <Box sx={{ display: "flex", gap: 2 }}>
              {navItems.map((item) => (
                <Button key={item.label} color="inherit" component={Link} to={item.path}>
                  {item.label}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Component */}
      <Sidebar open={mobileOpen} handleDrawerToggle={handleDrawerToggle} navItems={navItems} />
    </>
  );
};

export default Navbar;
