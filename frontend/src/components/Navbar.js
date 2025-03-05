import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import DropdownMenu from "./DropdownMenu";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Helper function to determine if a dropdown menu should be highlighted
  const isDropdownActive = (items) => {
    return items.some((item) => location.pathname === item.path);
  };

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
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {/* Dashboard Button */}
              <Button
                color="inherit"
                component={Link}
                to="/dashboard"
                sx={{
                  fontWeight: location.pathname === "/dashboard" ? "bold" : "normal",
                  opacity: location.pathname === "/dashboard" ? 1 : 0.7,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
                }}
              >
                Dashboard
              </Button>

              {/* Visitor Management Dropdown */}
              <DropdownMenu
                label="Visitor Management"
                items={[
                  { label: "Check-In", path: "/checkin" },
                  { label: "Visitor List", path: "/visitorlist" },
                  { label: "Check-Out", path: "/checkout" },
                  { label: "Pre-Scheduling", path: "/presheduling" },

                ]}
                active={isDropdownActive([
                  { path: "/checkin" },
                  { path: "/visitorlist" },
                  { path: "/checkout" },
                  { path: "/presheduling" },

                ])}
              />

              {/* Vehicle Management Dropdown */}
              <DropdownMenu
                label="Vehicle Management"
                items={[
                  { label: "Vehicle Details", path: "/vehicle-details" },
                  { label: "Vehicle Registration", path: "/vehicle-registration" },
                ]}
                active={isDropdownActive([
                  { path: "/vehicle-details" },
                  { path: "/vehicle-registration" },
                ])}
              />

              {/* Admin Access Dropdown */}
              <DropdownMenu
                label="Admin Access"
                items={[
                  { label: "Admin Dashboard", path: "/admin" },
                  { label: "Admin Panel", path: "/admin2" },
                  { label: "Company Login", path: "/companylogin" },
                ]}
                active={isDropdownActive([
                  { path: "/admin" },
                  { path: "/admin2" },
                  { path: "/companylogin" },
                ])}
              />

              {/* Logout Button */}
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  fontWeight: location.pathname === "/" ? "bold" : "normal",
                  opacity: location.pathname === "/" ? 1 : 0.7,
                  "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Sidebar Component - For Mobile View */}
      <Sidebar open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
    </>
  );
};

export default Navbar;