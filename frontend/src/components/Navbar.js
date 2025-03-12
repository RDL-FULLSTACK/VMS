

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
  const isMobile = useMediaQuery("(max-width: 900px)");
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch user role from backend on mount
  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserRole("guest");
        return;
      }

      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
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

    fetchUserRole();
  }, [navigate]);

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

  // Define navigation items based on role
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
            // { label: "Pre-Scheduling", path: "/presheduling" },
          ],
        },
        {
          type: "button",
          label: "Vehicle Management", path:"/vehicles"
      
        },

        // {
        //   type: "button",
        //   label: "HOST",path:"/HostDashboard"
        // },
        



        {
          type: "button",
          label: "ADMIN", path:"/userlist"
        
        },
        





        // { type: "button", label: "Admin", path: "/companylogin" },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
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
            // { label: "Pre-Scheduling", path: "/presheduling" },
          ],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
      security: [
        {
          type: "button",
          label: "Vehicle Management", path:"/vehicles"
          // items: [
          //   { label: "Vehicle Details", path: "/vehicle-details" },
          //   { label: "Vehicle Registration", path: "/vehicle-registration" },
          //   { label: "Vehicle Checkout", path: "/vehicle-checkout" },
          // ],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
  

      host: [
        {type: "button", label: "Pre-Scheduling", path : "/presheduling"},
        { type: "button", label: "Host", path: "/HostDashboard" },
        { type: "button", label: "Logout", path: "/" },
      ],


      guest: [
        { type: "button", label: "Login", path: "/" },
        { type: "button", label: "Register", path: "/companyregister" },
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
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Visitor Management System
          </Typography>

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