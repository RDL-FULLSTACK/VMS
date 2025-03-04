import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom"; // Add this import

const DropdownMenu = ({ label, items, active }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        color="inherit"
        onClick={handleClick}
        sx={{
          fontWeight: active ? "bold" : "normal",
          opacity: active ? 1 : 0.7,
          "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
        }}
      >
        {label}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {items.map((item) => (
          <MenuItem
            key={item.label}
            component={Link}
            to={item.path}
            onClick={handleClose}
            sx={{
              fontWeight: window.location.pathname === item.path ? "bold" : "normal",
            }}
          >
            {item.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default DropdownMenu;