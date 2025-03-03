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
import VehicleRegistration from "./pages/VehicleRegistration";
import VehicleDetails from "./pages/VehicleDetails";
import Login from "./pages/Login";

function App() {
  return (
    <>
   
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/editcheckin" element={<EditCheckin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/companylogin" element={[<CompanyLogin/>]} />
        <Route path="/visitorcard" element={[<VisitorCard/>]}/>
        <Route path="/vehicle-registration" element={[<VehicleRegistration/>]}/>
        <Route path="/vehicle-details" element={[<VehicleDetails/>]}/>
      </Routes>
      </>
    
  );
}

export default App;
