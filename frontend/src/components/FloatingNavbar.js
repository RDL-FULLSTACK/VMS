// components/FloatingNavbar.js
import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";

const FloatingNavbar = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedNotification = localStorage.getItem("customNotification") || "";
    const notificationArray = storedNotification
      .split("\n")
      .filter((item) => item.trim() !== "");
    setNotifications(notificationArray);
  }, []);

  const notificationText = notifications.length > 0
    ? notifications.join("    •    ")
    : "";

  if (!notificationText) return null;

  return (
    <Box
      sx={{
        position: "fixed", // Ensures it stays fixed relative to the viewport
        top: 64, // Matches the default height of MUI Navbar (AppBar)
        left: 0,
        right: 0,
        bgcolor: "#1976d2",
        color: "white",
        p: 0.5,
        textAlign: "center",
        zIndex: 1100, // Higher than most content but below modals (1300)
        overflow: "hidden",
        height: 30,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Box
        sx={{
          display: "inline-block",
          whiteSpace: "nowrap",
          animation: "marquee 15s linear infinite",
          "@keyframes marquee": {
            "0%": { transform: "translateX(100%)" },
            "100%": { transform: "translateX(-100%)" },
          },
        }}
      >
        <Typography variant="body2" sx={{ px: 4 }}>
          {notificationText}
        </Typography>
      </Box>
    </Box>
  );
};

export default FloatingNavbar;