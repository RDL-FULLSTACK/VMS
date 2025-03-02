import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/checkout";
import Checkin from "./pages/checkin"; // Adjust path if needed
import EditCheckin from "./pages/editcheckin";




function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/editcheckin" element={<EditCheckin />} />

      </Routes>
    
  );
}

export default App;
