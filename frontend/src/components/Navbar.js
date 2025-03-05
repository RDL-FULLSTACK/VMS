// //Navbar.js

// import React, { useState } from "react";
// import { AppBar, Toolbar, Typography, Button, Box, IconButton, useMediaQuery } from "@mui/material";
// import { Link, useLocation } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import Sidebar from "./Sidebar";
// import DropdownMenu from "./DropdownMenu";

// const Navbar = () => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const isMobile = useMediaQuery("(max-width: 900px)");
//   const location = useLocation();

//   const handleDrawerToggle = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   // Helper function to determine if a dropdown menu should be highlighted
//   const isDropdownActive = (items) => {
//     return items.some((item) => location.pathname === item.path);
//   };

//   return (
//     <>
//       <AppBar position="static" sx={{ backgroundColor: "#5a3d91" }}>
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ fontWeight: "bold" }}>
//             Visitor Management System
//           </Typography>

//           {/* Mobile View: Hamburger Menu */}
//           {isMobile ? (
//             <IconButton color="inherit" onClick={handleDrawerToggle}>
//               <MenuIcon />
//             </IconButton>
//           ) : (
//             /* Desktop View: Navigation Links */
//             <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//               {/* Dashboard Button */}
//               <Button
//                 color="inherit"
//                 component={Link}
//                 to="/dashboard"
//                 sx={{
//                   fontWeight: location.pathname === "/dashboard" ? "bold" : "normal",
//                   opacity: location.pathname === "/dashboard" ? 1 : 0.7,
//                   "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
//                 }}
//               >
//                 Dashboard
//               </Button>

//               {/* Visitor Management Dropdown */}
//               <DropdownMenu
//                 label="Visitor Management"
//                 items={[
//                   { label: "Check-In", path: "/checkin" },
//                   { label: "Visitor List", path: "/visitorlist" },
//                   { label: "Check-Out", path: "/checkout" },
//                   { label: "Pre-Scheduling", path: "/presheduling" },

//                 ]}
//                 active={isDropdownActive([
//                   { path: "/checkin" },
//                   { path: "/visitorlist" },
//                   { path: "/checkout" },
//                   { path: "/presheduling" },

//                 ])}
//               />

//               {/* Vehicle Management Dropdown */}
//               <DropdownMenu
//                 label="Vehicle Management"
//                 items={[
//                   { label: "Vehicle Details", path: "/vehicle-details" },
//                   { label: "Vehicle Registration", path: "/vehicle-registration" },
//                   { label: "Vehicle Checkout", path: "/vehicle-checkout/" },
                  

//                 ]}
//                 active={isDropdownActive([
//                   { path: "/vehicle-details" },
//                   { path: "/vehicle-registration" },
//                   { path: "/vehicle-checkout/" },

//                 ])}
//               />

//               {/* Admin Access Dropdown */}
//               <DropdownMenu
//                 label="Host "
//                 items={[
//                   { label: "Host Dashboard", path: "/HostDashboard" },
//                   // { label: "Host Panel", path: "/admin2" },
//                   // { label: "Admin Login", path: "/companylogin" },
//                 ]}
//                 active={isDropdownActive([
//                   { path: "/admin" },
//                   { path: "/admin2" },
//                   { path: "/companylogin" },
//                 ])}
//               />

//               {/* Logout Button */}
//               <Button
//                 color="inherit"
//                 component={Link}
//                 to="/"
//                 sx={{
//                   fontWeight: location.pathname === "/" ? "bold" : "normal",
//                   opacity: location.pathname === "/" ? 1 : 0.7,
//                   "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
//                 }}
//               >
//                 Logout
//               </Button>

//               <Button
//                 color="inherit"
//                 component={Link}
//                 to="/companylogin"
//                 sx={{
//                   fontWeight: location.pathname === "/" ? "bold" : "normal",
//                   opacity: location.pathname === "/" ? 1 : 0.7,
//                   "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
//                 }}
//               >
//                 Admin
//               </Button>



//             </Box>
//           )}
//         </Toolbar>
//       </AppBar>

//       {/* Sidebar Component - For Mobile View */}
//       <Sidebar open={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
//     </>
//   );
// };

// export default Navbar;






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
          label: "Visitor Management",
          items: [
            { label: "Check-In", path: "/checkin" },
            { label: "Visitor List", path: "/visitorlist" },
            { label: "Check-Out", path: "/checkout" },
            { label: "Pre-Scheduling", path: "/presheduling" },
          ],
        },
        {
          type: "dropdown",
          label: "Vehicle Management",
          items: [
            { label: "Vehicle Details", path: "/vehicle-details" },
            { label: "Vehicle Registration", path: "/vehicle-registration" },
            { label: "Vehicle Checkout", path: "/vehicle-checkout" },
          ],
        },
        {
          type: "dropdown",
          label: "Host",
          items: [{ label: "Host Dashboard", path: "/HostDashboard" }],
        },
        { type: "button", label: "Admin", path: "/companylogin" },
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
            { label: "Pre-Scheduling", path: "/presheduling" },
          ],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
      security: [
        {
          type: "dropdown",
          label: "Vehicle Management",
          items: [
            { label: "Vehicle Details", path: "/vehicle-details" },
            { label: "Vehicle Registration", path: "/vehicle-registration" },
            { label: "Vehicle Checkout", path: "/vehicle-checkout" },
          ],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
      ],
      host: [
        {
          type: "dropdown",
          label: "Host",
          items: [{ label: "Host Dashboard", path: "/HostDashboard" }],
        },
        { type: "button", label: "Logout", path: "/", onClick: handleLogout },
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