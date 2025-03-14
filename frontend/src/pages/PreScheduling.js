import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Custom CSS for larger toasts
const toastStyles = `
  .custom-toast {
    font-size: 18px; /* Increase font size */
    padding: 20px 30px; /* Increase padding for larger toast */
    min-width: 400px; /* Minimum width of the toast */
    border-radius: 8px; /* Slightly larger border radius */
    line-height: 1.5; /* Better readability */
  }
  .custom-toast .Toastify__toast-body {
    white-space: pre-line; /* Ensure line breaks are respected */
  }
`;

const departments = [
  "Human Resources (HR)",
  "Finance & Accounting",
  "Sales & Marketing",
  "IT (Information Technology)",
  "Operations",
  "Customer Service",
  "Research & Development (R&D)",
  "Procurement & Supply Chain",
  "Legal",
];


const PreScheduling = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    date: "",
    purpose: "",
    host: "",
    email: "",
    department: "",
  }); 
  const [loading, setLoading] = useState(false);
  const [fetchingHosts, setFetchingHosts] = useState(true);
  const [errors, setErrors] = useState({});
  const [hosts, setHosts] = useState([]);

  // Fetch hosts (users with role "Host") from MongoDB
  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setFetchingHosts(true);
        console.log("Fetching hosts from: http://localhost:5000/api/users");
        const response = await axios.get("http://localhost:5000/api/users", {
          withCredentials: true,
        });
        console.log("Hosts response:", response.data);
        const hostUsers = response.data.filter((user) => user.role.toLowerCase() === "host");
        setHosts(hostUsers);
        setFetchingHosts(false);
      } catch (error) {
        console.error("Error fetching hosts:", {
          message: error.message,
          response: error.response ? error.response.data : null,
          status: error.response ? error.response.status : null,
        });
        setErrors((prev) => ({ ...prev, host: "Failed to load hosts. Please try again later." }));
        setFetchingHosts(false);
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let error = "";
    if (name === "fullName" && value && !/^[A-Za-z\s]+$/.test(value)) {
      error = "Name must contain only letters and spaces";
    } else if (name === "fullName" && !value) {
      error = "Name is required";
    } else if (name === "date" && !value) {
      error = "Date is required";
    } else if (name === "purpose" && !value) {
      error = "Purpose is required";
    } else if (name === "host" && !value) {
      error = "Host is required";
    } else if (name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = "Invalid email format";
    } else if (name === "email" && !value) {
      error = "Email is required";
    }else if (name === "department" && !value) {
      error = "Department is required";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = "Name is required";
    else if (!/^[A-Za-z\s]+$/.test(formData.fullName))
      newErrors.fullName = "Name must contain only letters and spaces";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.purpose) newErrors.purpose = "Purpose is required";
    if (!formData.host) newErrors.host = "Host is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.department) newErrors.department = "Department is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedHost =
        hosts.find((h) => h.id === formData.host)?.username ||
        hosts.find((h) => h._id === formData.host)?.username;
      if (!selectedHost) throw new Error("Selected host not found");

      console.log("Submitting form data:", {
        name: formData.fullName,
        date: formData.date,
        purpose: formData.purpose,
        host: selectedHost,
        email: formData.email,
        department: formData.department,
      });

      const response = await axios.post(
        "http://localhost:5000/api/preschedule",
        {
          name: formData.fullName,
          date: formData.date,
          purpose: formData.purpose,
          host: selectedHost,
          email: formData.email,
          department: formData.department,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Form submission response:", response.data);
      toast.success(
        `Form submitted!\nName: ${formData.fullName}\nDate: ${formData.date}\nPurpose: ${formData.purpose}\nHost: ${selectedHost}\nEmail: ${formData.email}\nDepartment: ${formData.department}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "custom-toast", // Apply custom class
        }
      );
      setFormData({ fullName: "", date: "", purpose: "", host: "", email: "", department: "" });
      setErrors({});
    } catch (error) {
      console.error("Error submitting form:", {
        message: error.message,
        response: error.response ? error.response.data : null,
        status: error.response ? error.response.status : null,
      });
      const errorMsg = error.response
        ? error.response.data.message || "Server error occurred"
        : "Network error. Please check your connection or server status.";
      toast.error(`Failed to submit form: ${errorMsg}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "custom-toast", // Apply custom class
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f4f4f4",
      }}
    >
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          padding: "40px",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "60px",
            borderRadius: "15px",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.1)",
            width: "600px",
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          <h2 style={{ marginBottom: "30px", fontSize: "28px" }}>
            Pre-Scheduling & Approval
          </h2>
          {fetchingHosts ? (
            <p>Loading hosts...</p>
          ) : hosts.length === 0 ? (
            <p style={{ color: "red" }}>No hosts available. Please try again later.</p>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "25px" }}
            >
              <div>
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
                    border: errors.fullName ? "1px solid red" : "1px solid #ccc",
                    width: "566px",
                  }}
                />
                {errors.fullName && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errors.fullName}
                  </p>
                )}
              </div>
              <div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  min={new Date().toISOString().split("T")[0]}
                  style={{
                    padding: "16px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: errors.date ? "1px solid red" : "1px solid #ccc",
                    width: "566px",
                  }}
                />
                {errors.date && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.date}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="purpose"
                  placeholder="Purpose of Visit*"
                  value={formData.purpose}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{
                    padding: "16px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: errors.purpose ? "1px solid red" : "1px solid #ccc",
                    width: "566px",
                  }}
                />
                {errors.purpose && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>
                    {errors.purpose}
                  </p>
                )}
              </div>
              <div>
                <select
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  required
                  disabled={loading || hosts.length === 0}
                  style={{
                    padding: "16px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: errors.host ? "1px solid red" : "1px solid #ccc",
                    width: "100%",
                  }}
                >
                  <option value="" disabled>
                    Select Host*
                  </option>
                  {hosts.map((host) => (
                    <option key={host._id} value={host._id}>
                      {host.username}
                    </option>
                  ))}
                </select>
                {errors.host && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.host}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  style={{
                    padding: "16px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: errors.email ? "1px solid red" : "1px solid #ccc",
                    width: "566px",
                  }}
                />
                {errors.email && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.email}</p>
                )}
              </div>
              <div>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  disabled={loading || hosts.length === 0}
                  style={{
                    padding: "16px",
                    fontSize: "20px",
                    borderRadius: "8px",
                    border: errors.department ? "1px solid red" : "1px solid #ccc",
                    width: "100%",
                  }}
                >
                  <option value="" disabled>
                    Select Department*
                  </option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.host && (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>{errors.host}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading || hosts.length === 0}
                style={{
                  padding: "16px",
                  fontSize: "20px",
                  backgroundColor: loading || hosts.length === 0 ? "#ccc" : "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: loading || hosts.length === 0 ? "not-allowed" : "pointer",
                  transition: "background-color 0.3s",
                }}
                onMouseOver={(e) =>
                  !loading && hosts.length > 0 && (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseOut={(e) =>
                  !loading && hosts.length > 0 && (e.target.style.backgroundColor = "#3b82f6")
                }
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Inject custom styles for toast */}
      <style>{toastStyles}</style>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="custom-toast" // Apply custom class to all toasts
      />
    </div>
  );
};

export default PreScheduling; 