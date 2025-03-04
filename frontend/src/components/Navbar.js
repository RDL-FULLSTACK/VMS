import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom"; // Added useLocation
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation(); // Get current location

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Check-In", path: "/checkin" },
    { label: "Pre-Scheduling", path: "/pre-scheduling" },
    { label: "Check-Out", path: "/checkout" },
    { label: "Receptionist", path: "/receptionist" },
    { label: "Admin", path: "/Admin" }
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
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Button
                    key={item.label}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    sx={{
                      // Conditional styling based on active state
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.2)" : "transparent",
                      opacity: isActive ? 1 : 0.7,
                      fontWeight: isActive ? "bold" : "normal",
                      "&:hover": {
                        backgroundColor: isActive 
                          ? "rgba(255, 255, 255, 0.3)" 
                          : "rgba(255, 255, 255, 0.1)",
                        opacity: 1
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Component - We'll need to pass the location to Sidebar too */}
      <Sidebar 
        open={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
        navItems={navItems}
        currentPath={location.pathname} // Pass current path to Sidebar
      />
    </>
  );
};

export default Navbar;