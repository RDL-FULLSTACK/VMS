import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin"; // Adjust path if needed
import EditCheckin from "./pages/editcheckin";
import { AdminPanelSettings } from "@mui/icons-material";
import Admin from "./pages/admin"; // Import Admin1 properly
import CompanyLogin from "./pages/companylogin";
import VisitorCard from "./pages/visitorcard";

function App() {
  return (
    <>
   
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/editcheckin" element={<EditCheckin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/companylogin" element={[<CompanyLogin/>]} />
        <Route path="/visitorcard" element={[<VisitorCard/>]}/>



      </Routes>
      </>
    
  );
}

export default App;
