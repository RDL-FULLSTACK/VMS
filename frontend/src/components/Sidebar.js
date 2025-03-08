

import React from "react";
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Collapse,
} from "@mui/material";
import { Link } from "react-router-dom";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const Sidebar = ({ open, handleDrawerToggle, navItems }) => {
  const [openDropdowns, setOpenDropdowns] = React.useState({});

  // Toggle dropdown state
  const handleDropdownToggle = (label) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const renderMenuItems = () => {
    return navItems.map((item, index) => {
      if (item.type === "button") {
        return (
          <ListItem key={index} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => {
                if (item.onClick) item.onClick(); // Handle logout or custom click
                handleDrawerToggle();
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        );
      } else if (item.type === "dropdown") {
        return (
          <React.Fragment key={index}>
            <ListItem disablePadding>
              <ListItemButton onClick={() => handleDropdownToggle(item.label)}>
                <ListItemText primary={item.label} />
                {openDropdowns[item.label] ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openDropdowns[item.label]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.items.map((subItem, subIndex) => (
                  <ListItem key={subIndex} disablePadding sx={{ pl: 4 }}>
                    <ListItemButton
                      component={Link}
                      to={subItem.path}
                      onClick={handleDrawerToggle}
                    >
                      <ListItemText primary={subItem.label} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>
          </React.Fragment>
        );
      }
      return null;
    });
  };

  return (
    <Drawer anchor="left" open={open} onClose={handleDrawerToggle}>
      <Box sx={{ width: 250 }}>
        <Typography variant="h6" sx={{ p: 2, fontWeight: "bold" }}>
          VMS Navigation
        </Typography>
        <Divider />
        <List>{renderMenuItems()}</List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;