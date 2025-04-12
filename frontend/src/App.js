//app.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin";
import EditCheckin from "./pages/editcheckin";
import Admin from "./pages/admin";
import CompanyLogin from "./pages/companylogin";
import VisitorCard from "./pages/visitorcard";
import Login from "./pages/Login";
import VisitorList from "./pages/VisitorList";
import Admin2 from "./pages/admin2";
import HostDashboard from "./pages/HostDashboard";
import UpdateStatus from "./pages/UpdateStatus";
import PreScheduling from "./pages/PreScheduling";
import { SuccessPage } from "./pages/checkout";
import CombinedVehiclePage from "./pages/CombinedVehiclePage";
import HomeVisitorFormCheckIn from "./pages/HostVisitorFromCheckIn";
import Receptionist from "./pages/UserList";
import Reports from "./pages/Reports";
import SelfCheck from "./pages/SelfCheck";
import Employee from "./pages/Employee";
import Settings from "./pages/Setting";
import VideoUpload from "./pages/VideoUpload";
import QuizDisplay from "./pages/QuizDisplay";
import LoginKiosk from "./pages/LoginKiosk";
import VideoPage from "./pages/VideoPage";
import VisitorCardKiosk from "./pages/VisitorCardKiosk";
import Kioskquiz from "./pages/Kioskquiz";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
        <Route path="/checkin" element={<PrivateRoute><Checkin /></PrivateRoute>} />
        <Route path="/editcheckin/:id" element={<PrivateRoute><EditCheckin /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><Admin /></PrivateRoute>} />
        <Route path="/admin2" element={<PrivateRoute><Admin2 /></PrivateRoute>} />
        <Route path="/visitorcard" element={<PrivateRoute><VisitorCard /></PrivateRoute>} />
        <Route path="/visitorcard/:visitorId" element={<PrivateRoute><VisitorCard /></PrivateRoute>} />
        <Route path="/visitorlist" element={<PrivateRoute><VisitorList /></PrivateRoute>} />
        <Route path="/HostDashboard" element={<PrivateRoute><HostDashboard /></PrivateRoute>} />
        <Route path="/update-status/:id" element={<PrivateRoute><UpdateStatus /></PrivateRoute>} />
        <Route path="/presheduling" element={<PrivateRoute><PreScheduling /></PrivateRoute>} />
        <Route path="/success" element={<PrivateRoute><SuccessPage /></PrivateRoute>} />
        <Route path="/vehicles" element={<PrivateRoute><CombinedVehiclePage /></PrivateRoute>} />
        <Route path="/companylogin/" element={<PrivateRoute><CompanyLogin /></PrivateRoute>} />
        <Route path="/HostVisitorFormCheckIn/" element={<PrivateRoute><HomeVisitorFormCheckIn /></PrivateRoute>} />
        <Route path="/userlist" element={<Receptionist />} />
        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
        <Route path="/Setting" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/video-upload" element={<PrivateRoute><VideoUpload /></PrivateRoute>} />
        <Route path="/quizzes" element={<PrivateRoute><QuizDisplay /></PrivateRoute>} />
        <Route path="/employees" element={<Employee />} />
        <Route path="/self-check" element={<SelfCheck />} />
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/loginKiosk" element={<LoginKiosk />} />
        <Route path="/VideoPage" element={<VideoPage />} />
        <Route path="/Kioskquiz" element={<Kioskquiz/>}/>
        <Route path="/VisitorCardkiosk" element={<PrivateRoute><VisitorCardKiosk /></PrivateRoute>} />
        <Route path="/VisitorCardKiosk/:visitorId" element={<PrivateRoute><VisitorCardKiosk /></PrivateRoute>} />
        

      </Routes>
    </>
  );
}

export default App;