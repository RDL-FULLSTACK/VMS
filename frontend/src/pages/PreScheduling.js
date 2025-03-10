import React, { useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

const PreScheduling = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    date: "",
    purpose: "",
    host: "",
  });
  const [loading, setLoading] = useState(false);

  const hosts = [
    { id: "host1", name: "Alice Johnson" },
    { id: "host2", name: "Bob Smith" },
    { id: "host3", name: "Charlie Brown" },
    { id: "host4", name: "Diana Lee" },
    { id: "host5", name: "Eve Taylor" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/preschedule", {
        name: formData.fullName,
        date: formData.date,
        purpose: formData.purpose,
        host: formData.host,
      });
      alert(`Form submitted!\nName: ${formData.fullName}\nDate: ${formData.date}\nPurpose: ${formData.purpose}\nHost: ${hosts.find(h => h.id === formData.host)?.name}`);
      setFormData({ fullName: "", date: "", purpose: "", host: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please check your network or try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundColor: "#f4f4f4",
    }}>
      <Navbar />
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexGrow: 1,
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
              disabled={loading}
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
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
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
              disabled={loading}
              style={{
                padding: "16px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            />
            <select
              name="host"
              value={formData.host}
              onChange={handleChange}
              required
              disabled={loading}
              style={{
                padding: "16px",
                fontSize: "20px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                width: "100%",
              }}
            >
              <option value="" disabled>Select Host*</option>
              {hosts.map(host => (
                <option key={host.id} value={host.id}>{host.name}</option>
              ))}
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "16px",
                fontSize: "20px",
                backgroundColor: loading ? "#ccc" : "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PreScheduling;