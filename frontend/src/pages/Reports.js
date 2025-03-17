import React, { useState } from "react";
import { Tabs, Tab, Paper, Typography, Box } from "@mui/material";
import Navbar from "../components/Navbar";
import VisitorReport from "./VisitorReport";
import VehicleReport from "./VehicleReport";
import Footer from "../components/Footer";

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: "20px" }}>
        <Paper elevation={3} style={{ padding: "20px", borderRadius: "8px" }}>
          <Typography variant="h5" gutterBottom>
            Reports
          </Typography>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            style={{ justifyContent: "flex-start" }}
          >
            <Tab
              label="Visitor Report"
              style={{
                textTransform: "none",
                fontSize: "16px",
                color: activeTab === 0 ? "#1976d2" : "gray",
                borderBottom: activeTab === 0 ? "2px solid #1976d2" : "none",
                marginRight: "20px",
              }}
            />
            <Tab
              label="Vehicle Report"
              style={{
                textTransform: "none",
                fontSize: "16px",
                color: activeTab === 1 ? "#1976d2" : "gray",
                borderBottom: activeTab === 1 ? "2px solid #1976d2" : "none",
              }}
            />
          </Tabs>
          <Box mt={3}>
            {activeTab === 0 && <VisitorReport />}
            {activeTab === 1 && <VehicleReport />}
          </Box>
        </Paper>
      </div>
      <Footer />
    </>
  );
};

export default Reports;