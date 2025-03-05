// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Home from "./pages/Home";
// import Checkout from "./pages/checkout";
// import Checkin from "./pages/checkin"; // Adjust path if needed
// import EditCheckin from "./pages/editcheckin";
// import Admin from "./pages/admin"; // Import Admin properly
// import CompanyLogin from "./pages/companylogin";
// import VisitorCard from "./pages/visitorcard";
// import VehicleRegistration from "./pages/VehicleRegistration";
// import VehicleDetails from "./pages/VehicleDetails";
// import Login from "./pages/Login";
// import VisitorList from "./pages/VisitorList";
// import Navbar from "./components/Navbar";
// import Admin2 from "./pages/admin2";
// import HostDashboard from "./pages/HostDashboard";
// import UpdateStatus from "./pages/UpdateStatus"; // Import UpdateStatus
// import PreScheduling from "./pages/PreScheduling";
// import { SuccessPage } from "./pages/checkout";
// import VehicleCheckoutRoutes from "./pages/VehicleCheckout";

// function App() {
//   return (
//     <Routes>
//       <Route path="/dashboard" element={<Home />} />
//       <Route path="/" element={<Login />} />
//       <Route path="/checkout" element={<Checkout />} />
//       <Route path="/checkin" element={<Checkin />} />
//       <Route path="/editcheckin/:id" element={<EditCheckin />} /> {/* ✅ Dynamic Route */}
//       <Route path="/admin" element={<Admin />} />
//       <Route path="/admin2" element={<Admin2 />} />
//       <Route path="/companylogin" element={<CompanyLogin />} />
//       <Route path="/visitorcard/:id" element={<VisitorCard />} /> {/* ✅ Dynamic Route */}
//       <Route path="/vehicle-registration" element={<VehicleRegistration />} />
//       <Route path="/vehicle-details" element={<VehicleDetails />} />
//       <Route path="/visitorlist" element={<VisitorList />} />
//       <Route path="/HostDashboard" element={<HostDashboard />} />
//       <Route path="/update-status/:id" element={<UpdateStatus />} /> 
//       <Route path="/presheduling" element={<PreScheduling />} /> 
//       <Route path="/success" element={<SuccessPage />} />
//       <Route path="/vehicle-checkout/" element={<VehicleCheckoutRoutes />} />
//     </Routes>
//   );
// }

// export default App;



import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin";
import EditCheckin from "./pages/editcheckin";
import Admin from "./pages/admin";
import CompanyLogin from "./pages/companylogin";
import VisitorCard from "./pages/visitorcard";
import VehicleRegistration from "./pages/VehicleRegistration";
import VehicleDetails from "./pages/VehicleDetails";
import Login from "./pages/Login";
import VisitorList from "./pages/VisitorList";
import Navbar from "./components/Navbar";
import Admin2 from "./pages/admin2";
import HostDashboard from "./pages/HostDashboard";
import UpdateStatus from "./pages/UpdateStatus";
import PreScheduling from "./pages/PreScheduling";
import { SuccessPage } from "./pages/checkout";
import VehicleCheckoutRoutes from "./pages/VehicleCheckout";
import  Receptionist from "./pages/Receptionist";

// PrivateRoute component to protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    // No BrowserRouter here; it's in index.js
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      {/* <Route path="/companylogin" element={<CompanyLogin />} /> */}

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <PrivateRoute>
            <Checkout />
          </PrivateRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <PrivateRoute>
            <Checkin />
          </PrivateRoute>
        }
      />
      <Route
        path="/editcheckin/:id"
        element={
          <PrivateRoute>
            <EditCheckin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin2"
        element={
          <PrivateRoute>
            <Admin2 />
          </PrivateRoute>
        }
      />
      <Route
        path="/visitorcard/:id"
        element={
          <PrivateRoute>
            <VisitorCard />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicle-registration"
        element={
          <PrivateRoute>
            <VehicleRegistration />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicle-details"
        element={
          <PrivateRoute>
            <VehicleDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/visitorlist"
        element={
          <PrivateRoute>
            <VisitorList />
          </PrivateRoute>
        }
      />
      <Route
        path="/HostDashboard"
        element={
          <PrivateRoute>
            <HostDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/update-status/:id"
        element={
          <PrivateRoute>
            <UpdateStatus />
          </PrivateRoute>
        }
      />
      <Route
        path="/presheduling"
        element={
          <PrivateRoute>
            <PreScheduling />
          </PrivateRoute>
        }
      />
      <Route
        path="/success"
        element={
          <PrivateRoute>
            <SuccessPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/vehicle-checkout/"
        element={
          <PrivateRoute>
            <VehicleCheckoutRoutes />
          </PrivateRoute>
        }
      />

<Route
        path="/companylogin/"
        element={
          <PrivateRoute>
            <CompanyLogin />
          </PrivateRoute>
        }
      />


<Route path="/receptionist" element={<Receptionist />} />         
      {/* Catch-all route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;