import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin";
import EditCheckin from "./pages/editcheckin";
import Admin from "./pages/admin";
import CompanyLogin from "./pages/companylogin";
import VisitorCard from "./pages/visitorcard";
import Login from "./pages/Login";
import VisitorList from "./pages/VisitorList";
import Navbar from "./components/Navbar";
import Admin2 from "./pages/admin2";
import HostDashboard from "./pages/HostDashboard";
import UpdateStatus from "./pages/UpdateStatus";
import PreScheduling from "./pages/PreScheduling";
import { SuccessPage } from "./pages/checkout";
import VehicleCheckoutRoutes from "./pages/VehicleCheckout";
import Receptionist from "./pages/UserList";
import CombinedVehiclePage from "./pages/CombinedVehiclePage";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
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
          path="/visitorcard"
          element={
            <PrivateRoute>
              <VisitorCard />
            </PrivateRoute>
          }
        />
        <Route
          path="/visitorcard/:visitorId"
          element={
            <PrivateRoute>
              <VisitorCard />
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
          path="/vehicles"
          element={
            <PrivateRoute>
              <CombinedVehiclePage />
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
        <Route path="/userlist" element={<Receptionist />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000} // 3 seconds default duration
        hideProgressBar={false}
        newestOnTop={true} // New toasts appear on top
        closeOnClick
        pauseOnHover
        draggable
        limit={3} // Limits to 3 visible toasts at once
        style={{ zIndex: 9999 }} // Ensure toasts appear above other elements
        toastClassName="custom-toast" // Optional: for custom styling if needed
        onOpen={() => console.log("Toast opened")} // Debug: Log when a toast opens
        onClose={() => console.log("Toast closed")} // Debug: Log when a toast closes
      />
    </>
  );
}

export default App;