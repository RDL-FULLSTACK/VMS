// //DropdownMenu.js


// import React from "react";
// import { Button, Menu, MenuItem } from "@mui/material";
// import { Link } from "react-router-dom"; // Add this import

// const DropdownMenu = ({ label, items, active }) => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <>
//       <Button
//         color="inherit"
//         onClick={handleClick}
//         sx={{
//           fontWeight: active ? "bold" : "normal",
//           opacity: active ? 1 : 0.7,
//           "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)", opacity: 1 },
//         }}
//       >
//         {label}
//       </Button>
//       <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
//         {items.map((item) => (
//           <MenuItem
//             key={item.label}
//             component={Link}
//             to={item.path}
//             onClick={handleClose}
//             sx={{
//               fontWeight: window.location.pathname === item.path ? "bold" : "normal",
//             }}
//           >
//             {item.label}
//           </MenuItem>
//         ))}
//       </Menu>
//     </>
//   );
// };

// export default DropdownMenu;



import React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom"; // Added useNavigate

const DropdownMenu = ({ label, items, active }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate(); // For handling navigation programmatically

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = (item) => {
    handleClose(); // Close the menu
    if (item.onClick) {
      item.onClick(); // Execute custom onClick if provided (e.g., logout)
    } else {
      navigate(item.path); // Navigate to the path
    }
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
          textTransform: "none", // Match Navbar button style
        }}
      >
        {label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: "#fff",
            color: "#5a3d91", // Match Navbar color scheme if desired
          },
        }}
      >
        {items.map((item) => (
          <MenuItem
            key={item.label}
            component={item.onClick ? "div" : Link} // Use div for items with onClick (e.g., Logout)
            to={!item.onClick ? item.path : undefined} // Only set 'to' if no onClick
            onClick={() => handleItemClick(item)}
            sx={{
              fontWeight: window.location.pathname === item.path ? "bold" : "normal",
              "&:hover": { backgroundColor: "rgba(90, 61, 145, 0.1)" }, // Match hover effect
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