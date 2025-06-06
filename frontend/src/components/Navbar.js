

import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./Sidebar";
import DropdownMenu from "./DropdownMenu";
import axios from "axios";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState("guest");
  const [logoUrl, setLogoUrl] = useState(null); // State for logo
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const navigate = useNavigate();

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole("guest");
        return;
      }

      try {
        const response = await axios.get(`${BACKEND_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserRole(response.data.role || "guest");
      } catch (error) {
        console.error("Error fetching user role:", error);
        setUserRole("guest");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    const fetchLogo = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/logos`);
        if (response.data.length > 0) {
          setLogoUrl(response.data[0]); // Use the first logo
        }
      } catch (error) {
        console.error("Error fetching logo:", error);
      }
    };

    fetchUserRole();
    fetchLogo();
  }, [navigate, BACKEND_URL]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUserRole("guest");
    navigate("/");
  };

  const isDropdownActive = (items) => {
    return items.some((item) => location.pathname === item.path);
  };

  const getNavItems = () => {
    const navItems = {
      admin: [
        { type: "button", label: "Dashboard", path: "/dashboard" },
        {
          type: "dropdown",
          label: "VISITOR MANAGEMENT",
          items: [
            { label: "Check-In", path: "/checkin" },
            { label: "Visitor List", path: "/visitorlist" },
            { label: "Check-Out", path: "/checkout" },
          ],
        },
        {
          type: "button",
          label: "Vehicle Management",
          path: "/vehicles"
        },
        {
          type: "button",
          label: "Admin",
          path: "/userlist"
        },
        { type: "button", label: "SETTINGS", path: "/Setting" },
      ],
      receptionist: [
        { type: "button", label: "Dashboard", path: "/dashboard" },
        {
          type: "dropdown",
          label: "Visitor Management",
          items: [
            { label: "Check-In", path: "/checkin" },
            { label: "Visitor List", path: "/visitorlist" },
            { label: "Check-Out", path: "/checkout" },
          ],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
      security: [
        {
          type: "button",
          label: "Vehicle Management",
          path: "/vehicles"
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
      host: [
        { type: "button", label: "Pre-Scheduling", path: "/presheduling" },
        { type: "button", label: "Host", path: "/HostDashboard" },
        { type: "button", label: "Logout", path: "/" },
      ],
      guest: [
        { type: "button", label: "Login", path: "/" },
      ],
    };

    return navItems[userRole] || navItems["guest"];
  };

  const renderNavItems = () => {
    const items = getNavItems();

    return items.map((item, index) => {
      if (item.type === "button") {
        return (
          <Button
            key={index}
            color="inherit"
            component={Link}
            to={item.path}
            onClick={item.onClick || (() => {})}
            sx={{
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              opacity: location.pathname === item.path ? 1 : 0.7,
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
            }}
          >
            {item.label}
          </Button>
        );
      } else if (item.type === "dropdown") {
        return (
          <DropdownMenu
            key={index}
            label={item.label}
            items={item.items}
            active={isDropdownActive(item.items)}
          />
        );
      }
      return null;
    });
  };

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: "#5a3d91" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              style={{ maxHeight: "40px", objectFit: "contain" }}
            />
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Visitor Management System
            </Typography>
          )}

          {isMobile ? (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {renderNavItems()}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Sidebar
        open={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        navItems={getNavItems()}
      />
    </>
  );
};

export default Navbar;