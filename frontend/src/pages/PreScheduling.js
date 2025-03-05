import React, { useState } from "react";
import Navbar from "../components/Navbar"; // Added Navbar import

const PreScheduling = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    date: "",
    purpose: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted!\nName: ${formData.fullName}\nDate: ${formData.date}\nPurpose: ${formData.purpose}`);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column", // Changed to column to stack Navbar and content
      minHeight: "100vh", // Changed to minHeight to ensure full height
      backgroundColor: "#f4f4f4",
    }}>
      {/* Added Navbar */}
      <Navbar />
      
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1, // Added to make the content take remaining space
        padding: "40px",
      }}>
        <div style={{
          background: "#fff",
          padding: "60px",
          borderRadius: "15px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
          width: "600px",
          maxWidth: "90%",
          textAlign: "center",
        }}>
          <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>Pre-Scheduling & Approval</h2>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name*"
              value={formData.fullName}
              onChange={handleChange}
              required
              style={{
                padding: "16px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
            <input
              type="date"
              name="date"
              placeholder="dd-mm-yyyy"
              value={formData.date}
              onChange={handleChange}
              required
              style={{
                padding: "16px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
            <input
              type="text"
              name="purpose"
              placeholder="Purpose of Visit"
              value={formData.purpose}
              onChange={handleChange}
              required
              style={{
                padding: "16px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "16px",
                fontSize: "20px",
                backgroundColor: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreScheduling;