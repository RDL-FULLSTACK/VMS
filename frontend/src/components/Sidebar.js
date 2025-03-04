import React from "react";
import { Drawer, Box, Typography, List, ListItem, ListItemButton, ListItemText, Divider } from "@mui/material";
import { Link } from "react-router-dom";

const Sidebar = ({ open, handleDrawerToggle }) => {
  const menuItems = [
    { label: "Home", path: "/home" },
    { label: "Login", path: "/login" },
    { label: "Visitor Management", path: "/visitor-list" },
    { label: "Vehicle Management", path: "/vehicle-details" },
    { label: "Admin Access", path: "/admin" },
  ];

  return (
    <Drawer anchor="left" open={open} onClose={handleDrawerToggle}>
      <Box sx={{ width: 250 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
          VMS Navigation
        </Typography>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
