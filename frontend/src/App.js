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
import VisitorList from "./pages/VisitorList";
import Navbar from "./components/Navbar"
import Admin2 from "./pages/admin2"
import HostDashboard from "./pages/HostDashboard";
import UpdateStatus from "./pages/UpdateStatus"; // Import UpdateStatus

function App() {
  return (
    <>
   
   
      <Routes>
        <Route path="/dashboard" element={<Home />} />
        <Route path="/" element={<Login/>}/>
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/editcheckin" element={<EditCheckin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin2" element={<Admin2 />} />
        <Route path="/companylogin" element={[<CompanyLogin/>]} />
        <Route path="/visitorcard" element={[<VisitorCard/>]}/>
        <Route path="/vehicle-registration" element={[<VehicleRegistration/>]}/>
        <Route path="/vehicle-details" element={[<VehicleDetails/>]}/>
        <Route path="/visitorlist" element={[<VisitorList/>]}/>
        <Route path="/HostDashboard" element={<HostDashboard />} />
        <Route path="/update-status/:id" element={<UpdateStatus />} /> 
      </Routes>
      </>
    
  );
}

export default App;
