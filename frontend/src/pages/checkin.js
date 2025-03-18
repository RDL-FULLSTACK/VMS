// Checkin.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile, CameraAlt } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

const Checkin = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [hosts, setHosts] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    designation: "",
    visitType: "",
    expectedDurationHours: "",
    expectedDurationMinutes: "",
    documentDetails: "",
    reasonForVisit: "",
    otp: "",
    visitorCompany: "",
    personToVisit: "",
    submittedDocument: "",
    hasAssets: "",
    assets: [],
    hasTeamMembers: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [openAssetsModal, setOpenAssetsModal] = useState(false);
  const [openPrescheduleModal, setOpenPrescheduleModal] = useState(false);
  const [openSelfCheckinModal, setOpenSelfCheckinModal] = useState(false);
  const [openWebcamModal, setOpenWebcamModal] = useState(false);
  const [prescheduledVisitors, setPrescheduledVisitors] = useState([]);
  const [selfCheckinVisitors, setSelfCheckinVisitors] = useState([]);
  const [filteredPrescheduleVisitors, setFilteredPrescheduleVisitors] = useState([]);
  const [filteredSelfCheckinVisitors, setFilteredSelfCheckinVisitors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedSelfCheckinId, setSelectedSelfCheckinId] = useState(null);
  const [selectedPrescheduleId, setSelectedPrescheduleId] = useState(null); // New state for pre-schedule
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        const hostUsers = data.filter((user) => user.role.toLowerCase() === "host");
        setHosts(hostUsers);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        toast.error("Failed to load hosts.");
      }
    };

    const fetchPrescheduledVisitors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/preschedules");
        if (!response.ok) throw new Error("Failed to fetch prescheduled visitors");
        const data = await response.json();
        const approvedVisitors = data
          .filter((visitor) => visitor.status === "Approved")
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPrescheduledVisitors(approvedVisitors);
        setFilteredPrescheduleVisitors(approvedVisitors);
      } catch (error) {
        console.error("Error fetching prescheduled visitors:", error);
        toast.error("Failed to load prescheduled visitors.");
      }
    };

    const fetchSelfCheckinVisitors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/self-checkins/status");
        if (!response.ok) throw new Error("Failed to fetch self-checkin visitors");
        const data = await response.json();
        const sortedVisitors = data.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
        setSelfCheckinVisitors(sortedVisitors);
        setFilteredSelfCheckinVisitors(sortedVisitors);
      } catch (error) {
        console.error("Error fetching self-checkin visitors:", error);
        toast.error("Failed to load self-checkin history.");
      }
    };

    fetchHosts();
    fetchPrescheduledVisitors();
    fetchSelfCheckinVisitors();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
  }, [stream, photoPreview]);

  const handleSearch = (e, type) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (type === "preschedule") {
      const filtered = prescheduledVisitors.filter(
        (visitor) =>
          visitor.name.toLowerCase().includes(query) ||
          visitor.host.toLowerCase().includes(query)
      );
      setFilteredPrescheduleVisitors(filtered);
    } else if (type === "selfcheckin") {
      const filtered = selfCheckinVisitors.filter(
        (visitor) =>
          visitor.fullName.toLowerCase().includes(query) ||
          visitor.personToVisit.toLowerCase().includes(query)
      );
      setFilteredSelfCheckinVisitors(filtered);
    }
    setPage(0);
  };

  const handlePrescheduleSelect = (visitor) => {
    setFormData({
      fullName: visitor.name,
      email: visitor.email,
      phoneNumber: visitor.phoneNumber,
      designation: visitor.designation,
      visitType: visitor.visitType,
      expectedDurationHours: visitor.expectedDuration.hours.toString(),
      expectedDurationMinutes: visitor.expectedDuration.minutes.toString(),
      documentDetails: "",
      reasonForVisit: visitor.purpose,
      otp: "",
      visitorCompany: "",
      personToVisit: visitor.host,
      submittedDocument: "",
      hasAssets: visitor.hasAssets,
      assets: visitor.assets || [],
      hasTeamMembers: visitor.teamMembers.length > 0 ? "yes" : "no",
      department: visitor.department,
    });
    setTeamMembers(visitor.teamMembers || []);
    setSelectedPrescheduleId(visitor._id); // Store the selected pre-schedule ID
    setOpenPrescheduleModal(false);
    toast.success(`Data for ${visitor.name} has been loaded.`);
  };

  const handleSelfCheckinSelect = (visitor) => {
    setFormData({
      fullName: visitor.fullName,
      email: visitor.email,
      phoneNumber: visitor.phoneNumber,
      designation: visitor.designation,
      visitType: visitor.visitType,
      expectedDurationHours: visitor.expectedDuration.hours.toString(),
      expectedDurationMinutes: visitor.expectedDuration.minutes.toString(),
      documentDetails: visitor.documentDetails,
      reasonForVisit: visitor.reasonForVisit,
      otp: "",
      visitorCompany: visitor.visitorCompany,
      personToVisit: visitor.personToVisit,
      submittedDocument: visitor.submittedDocument,
      hasAssets: visitor.hasAssets,
      assets: visitor.assets || [],
      hasTeamMembers: visitor.hasTeamMembers,
      department: visitor.department,
    });
    setTeamMembers(visitor.teamMembers || []);
    setPhotoPreview(visitor.photoUrl || null);
    setSelectedSelfCheckinId(visitor._id);
    setOpenSelfCheckinModal(false);
    toast.success(`Data for ${visitor.fullName} has been loaded.`);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setOpenWebcamModal(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing webcam:", error);
      toast.error("Failed to access webcam.");
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setOpenWebcamModal(false);
  };

  const capturePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      const file = new File([blob], "webcam-photo.jpg", { type: "image/jpeg" });
      setPhoto(file);
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      stopWebcam();
      toast.success("Photo captured successfully!");
    }, "image/jpeg");
  };



  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName":
      case "personToVisit":
        if (!value) error = "Required";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Letters only";
        break;
      case "email":
        if (!value) error = "Required";
        else if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value))
          error = "Invalid email";
        break;
      case "phoneNumber":
        if (!value) error = "Required";
        else if (!/^\d{10}$/.test(value)) error = "10 digits required";
        break;
      case "designation":
      case "visitType":
      case "documentDetails":
      case "reasonForVisit":
      case "visitorCompany":
      case "submittedDocument":
      case "hasAssets":
      case "hasTeamMembers":
      case "department":
        if (!value) error = "Required";
        break;
      case "expectedDurationHours":
        if (!value) error = "Required";
        else if (!/^\d+$/.test(value) || parseInt(value) > 23)
          error = "0-23 only";
        break;
      case "expectedDurationMinutes":
        if (!value) error = "Required";
        else if (!/^\d+$/.test(value) || parseInt(value) > 59)
          error = "0-59 only";
        break;
      case "otp":
        if (!value) error = "Required";
        else if (!/^\d{6}$/.test(value)) error = "6 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const validateAssetField = (asset, field) => {
    return !asset[field] ? "Required" : "";
  };

  const handleInputChange = (field, value) => {
    const sanitizedValue =
      field === "fullName" || field === "personToVisit"
        ? value.replace(/[^A-Za-z\s]/g, "")
        : field === "phoneNumber" ||
          field === "expectedDurationHours" ||
          field === "expectedDurationMinutes" ||
          field === "otp"
        ? value.replace(/[^0-9]/g, "")
        : value;

    setFormData((prev) => ({ ...prev, [field]: sanitizedValue }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, sanitizedValue),
    }));

    if (field === "hasTeamMembers" && sanitizedValue === "yes") {
      setOpenTeamModal(true);
    }
    if (field === "hasAssets" && sanitizedValue === "yes") {
      setOpenAssetsModal(true);
    }
  };

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...formData.assets];
    updatedAssets[index][field] = value;
    setFormData((prev) => ({ ...prev, assets: updatedAssets }));
  };

  const handleAddAsset = () => {
    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets, { type: "", serialNumber: "" }],
    }));
  };

  const handleRemoveAsset = (index) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index),
    }));
  };

  const handleAddTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        name: "",
        email: "",
        documentDetail: "",
        document: null,
        hasAssets: "",
        assets: [],
      },
    ]);
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] =
      field === "name"
        ? value.replace(/[^A-Za-z\s]/g, "")
        : field === "email"
        ? value.replace(/[^A-Za-z0-9._%+-@]/g, "")
        : value;
    setTeamMembers(updatedMembers);
  };

  const handleTeamMemberAssetChange = (memberIndex, assetIndex, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[memberIndex].assets[assetIndex][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleAddTeamMemberAsset = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index].assets.push({ type: "", serialNumber: "" });
    setTeamMembers(updatedMembers);
  };

  const handleRemoveTeamMemberAsset = (memberIndex, assetIndex) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[memberIndex].assets = updatedMembers[memberIndex].assets.filter(
      (_, i) => i !== assetIndex
    );
    setTeamMembers(updatedMembers);
  };

  const handleSendEmailOtp = async () => {
    if (!formData.email) {
      toast.error("Please enter an email first!");
      return;
    }
    if (errors.email) {
      toast.error("Please enter a valid email address!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/visitors/send-email-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );

      if (!response.ok) throw new Error("Failed to send OTP");

      toast.success(`OTP sent to ${formData.email}!`);
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
    }
  };

  const verifyOtp = async () => {
    if (!formData.otp) {
      toast.error("Please enter the OTP!");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/visitors/verify-email-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, otp: formData.otp }),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      toast.success("OTP verified successfully!");
      setIsOtpVerified(true);
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
      setIsOtpVerified(false);
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field !== "assets") {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (!newErrors.expectedDurationHours && !newErrors.expectedDurationMinutes) {
      if (
        parseInt(formData.expectedDurationHours) === 0 &&
        parseInt(formData.expectedDurationMinutes) === 0
      ) {
        newErrors.expectedDurationHours = "Must be > 0";
        newErrors.expectedDurationMinutes = "Must be > 0";
      }
    }

    if (formData.hasAssets === "yes" && formData.assets.length === 0) {
      newErrors.assets = "At least one asset is required";
    } else if (formData.hasAssets === "yes") {
      formData.assets.forEach((asset, index) => {
        ["type", "serialNumber"].forEach((field) => {
          const error = validateAssetField(asset, field);
          if (error) newErrors[`asset_${index}_${field}`] = error;
        });
      });
    }

    if (formData.hasTeamMembers === "yes" && teamMembers.length === 0) {
      newErrors.teamMembers = "At least one team member is required";
    } else if (formData.hasTeamMembers === "yes") {
      teamMembers.forEach((member, memberIndex) => {
        ["name", "email", "documentDetail", "hasAssets"].forEach((field) => {
          const error = validateField(field, member[field]);
          if (error) newErrors[`teamMember_${memberIndex}_${field}`] = error;
        });

        if (member.hasAssets === "yes" && member.assets.length === 0) {
          newErrors[`teamMember_${memberIndex}_assets`] = "At least one asset is required";
        } else if (member.hasAssets === "yes") {
          member.assets.forEach((asset, assetIndex) => {
            ["type", "serialNumber"].forEach((field) => {
              const error = validateAssetField(asset, field);
              if (error)
                newErrors[`teamMember_${memberIndex}_asset_${assetIndex}_${field}`] = error;
            });
          });
        }
      });
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fill all required fields correctly!");
      return;
    }

    if (!isOtpVerified) {
      toast.error("Please verify OTP before submitting!");
      return;
    }

    try {
      const visitorData = new FormData();
      visitorData.append("fullName", formData.fullName);
      visitorData.append("email", formData.email);
      visitorData.append("phoneNumber", formData.phoneNumber);
      visitorData.append("designation", formData.designation);
      visitorData.append("visitType", formData.visitType);
      visitorData.append(
        "expectedDuration",
        JSON.stringify({
          hours: parseInt(formData.expectedDurationHours),
          minutes: parseInt(formData.expectedDurationMinutes),
        })
      );
      visitorData.append("documentDetails", formData.documentDetails);
      visitorData.append("reasonForVisit", formData.reasonForVisit);
      visitorData.append("otp", formData.otp);
      visitorData.append("visitorCompany", formData.visitorCompany);
      visitorData.append("personToVisit", formData.personToVisit);
      visitorData.append("submittedDocument", formData.submittedDocument);
      visitorData.append("hasAssets", formData.hasAssets);
      visitorData.append(
        "assets",
        formData.hasAssets === "yes" ? JSON.stringify(formData.assets) : JSON.stringify([])
      );
      visitorData.append("hasTeamMembers", formData.hasTeamMembers);
      visitorData.append(
        "teamMembers",
        formData.hasTeamMembers === "yes" ? JSON.stringify(teamMembers) : JSON.stringify([])
      );
      visitorData.append("department", formData.department);
      if (photo) {
        visitorData.append("photo", photo);
      }

      const response = await fetch("http://localhost:5000/api/visitors/checkin", {
        method: "POST",
        body: visitorData,
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Submission failed");

      // Delete self-checkin record if it exists
      if (selectedSelfCheckinId) {
        const deleteSelfCheckinResponse = await fetch(
          `http://localhost:5000/api/self-checkins/checkin/${selectedSelfCheckinId}`,
          {
            method: "DELETE",
          }
        );
        if (!deleteSelfCheckinResponse.ok) {
          const deleteData = await deleteSelfCheckinResponse.json();
          throw new Error(deleteData.message || "Failed to delete self-checkin");
        }

        setSelfCheckinVisitors((prev) =>
          prev.filter((visitor) => visitor._id !== selectedSelfCheckinId)
        );
        setFilteredSelfCheckinVisitors((prev) =>
          prev.filter((visitor) => visitor._id !== selectedSelfCheckinId)
        );
        setSelectedSelfCheckinId(null);
      }

      // Delete pre-scheduled record if it exists
      if (selectedPrescheduleId) {
        const deletePrescheduleResponse = await fetch(
          `http://localhost:5000/api/preschedules/${selectedPrescheduleId}`,
          {
            method: "DELETE",
          }
        );
        if (!deletePrescheduleResponse.ok) {
          const deleteData = await deletePrescheduleResponse.json();
          throw new Error(deleteData.message || "Failed to delete pre-scheduled visitor");
        }

        setPrescheduledVisitors((prev) =>
          prev.filter((visitor) => visitor._id !== selectedPrescheduleId)
        );
        setFilteredPrescheduleVisitors((prev) =>
          prev.filter((visitor) => visitor._id !== selectedPrescheduleId)
        );
        setSelectedPrescheduleId(null);
      }

      toast.success("Check-in successful!");
      setTimeout(() => navigate("/visitorcard"), 2000);
    } catch (error) {
      toast.error(error.message || "Submission error");
    }
  };

  const handleCloseTeamModal = () => {
    if (teamMembers.length === 0) {
      setFormData((prev) => ({ ...prev, hasTeamMembers: "no" }));
      setErrors((prev) => ({
        ...prev,
        hasTeamMembers: validateField("hasTeamMembers", "no"),
      }));
    }
    setOpenTeamModal(false);
  };

  const handleCloseAssetsModal = () => {
    if (formData.assets.length === 0) {
      setFormData((prev) => ({ ...prev, hasAssets: "no" }));
      setErrors((prev) => ({
        ...prev,
        hasAssets: validateField("hasAssets", "no"),
      }));
    }
    setOpenAssetsModal(false);
  };

  const handleViewTeamMembers = () => {
    setOpenTeamModal(true);
  };

  const handleViewAssets = () => {
    setOpenAssetsModal(true);
  };

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    maxHeight: "80vh",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

  const webcamModalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    textAlign: "center",
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          mt: 6,
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "#fff",
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          Visitor Check-In
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setOpenPrescheduleModal(true)}
          >
            Preschedule
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenSelfCheckinModal(true)}
          >
            Self Check-in History
          </Button>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
              required
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={handleSendEmailOtp}
                >
                  Send OTP
                </Button>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              inputProps={{ maxLength: 10 }}
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Designation"
              value={formData.designation}
              onChange={(e) => handleInputChange("designation", e.target.value)}
              error={!!errors.designation}
              helperText={errors.designation}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Visitor">Visitor</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Visit Type*"
              value={formData.visitType}
              onChange={(e) => handleInputChange("visitType", e.target.value)}
              error={!!errors.visitType}
              helperText={errors.visitType}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Hours"
                  value={formData.expectedDurationHours}
                  onChange={(e) => handleInputChange("expectedDurationHours", e.target.value)}
                  error={!!errors.expectedDurationHours}
                  helperText={errors.expectedDurationHours}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Minutes"
                  value={formData.expectedDurationMinutes}
                  onChange={(e) => handleInputChange("expectedDurationMinutes", e.target.value)}
                  error={!!errors.expectedDurationMinutes}
                  helperText={errors.expectedDurationMinutes}
                  required
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Document Details"
              value={formData.documentDetails}
              onChange={(e) => handleInputChange("documentDetails", e.target.value)}
              error={!!errors.documentDetails}
              helperText={errors.documentDetails}
              required
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Team Members?"
                      value={formData.hasTeamMembers}
                      onChange={(e) => handleInputChange("hasTeamMembers", e.target.value)}
                      error={!!errors.hasTeamMembers}
                      helperText={errors.hasTeamMembers}
                      required
                      variant="outlined"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item>
                    {formData.hasTeamMembers === "yes" && (
                      <Button
                        variant="outlined"
                        onClick={handleViewTeamMembers}
                        size="small"
                        sx={{ ml: 1, height: "40px" }}
                      >
                        View
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Assets?"
                      value={formData.hasAssets}
                      onChange={(e) => handleInputChange("hasAssets", e.target.value)}
                      error={!!errors.hasAssets}
                      helperText={errors.hasAssets}
                      required
                      variant="outlined"
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item>
                    {formData.hasAssets === "yes" && (
                      <Button
                        variant="outlined"
                        onClick={handleViewAssets}
                        size="small"
                        sx={{ ml: 1, height: "40px" }}
                      >
                        View
                      </Button>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
           
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CameraAlt />}
                  onClick={startWebcam}
                >
                  Click Now
                </Button>
              </Grid>
              <Grid item xs={12}>
                {photoPreview && (
                  <Box mt={2} textAlign="center">
                    <img
                      src={photoPreview}
                      alt="Visitor preview"
                      style={{ maxWidth: "100%", maxHeight: "200px" }}
                    />
                  </Box>
                )}
              </Grid>
            </Grid>

            <TextField
              fullWidth
              label="Reason for Visit"
              value={formData.reasonForVisit}
              onChange={(e) => handleInputChange("reasonForVisit", e.target.value)}
              error={!!errors.reasonForVisit}
              helperText={errors.reasonForVisit}
              required
              sx={{ mt: 2, mb: 2 }}
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="OTP"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value)}
                  error={!!errors.otp}
                  helperText={errors.otp}
                  required
                  inputProps={{ maxLength: 6 }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={verifyOtp}
                  sx={{ height: "56px" }}
                >
                  Verify OTP
                </Button>
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Visitor Company"
              value={formData.visitorCompany}
              onChange={(e) => handleInputChange("visitorCompany", e.target.value)}
              error={!!errors.visitorCompany}
              helperText={errors.visitorCompany}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Person to Visit"
              value={formData.personToVisit}
              onChange={(e) => handleInputChange("personToVisit", e.target.value)}
              error={!!errors.personToVisit}
              helperText={
                errors.personToVisit || (hosts.length === 0 ? "No hosts available" : "")
              }
              required
              sx={{ mb: 2 }}
              disabled={hosts.length === 0}
            >
              <MenuItem value="" disabled>
                Select Host
              </MenuItem>
              {hosts.map((host) => (
                <MenuItem key={host.id} value={host.username}>
                  {host.username}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Submitted Document"
              value={formData.submittedDocument}
              onChange={(e) => handleInputChange("submittedDocument", e.target.value)}
              error={!!errors.submittedDocument}
              helperText={errors.submittedDocument}
              required
              sx={{ mb: 2 }}
            >
              <MenuItem value="ID Proof">ID Proof</MenuItem>
              <MenuItem value="Passport">Passport</MenuItem>
            </TextField>
            <TextField
              select
              fullWidth
              label="Department"
              value={formData.department}
              onChange={(e) => handleInputChange("department", e.target.value)}
              error={!!errors.department}
              helperText={errors.department}
              required
            >
              <MenuItem value="" disabled>
                Select Department
              </MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Modal open={openPrescheduleModal} onClose={() => setOpenPrescheduleModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Approved Pre-Scheduled Visitors
            </Typography>
            <TextField
              fullWidth
              label="Search Visitors"
              value={searchQuery}
              onChange={(e) => handleSearch(e, "preschedule")}
              sx={{ mb: 2 }}
              placeholder="Search by visitor name or host name"
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Purpose</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredPrescheduleVisitors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((visitor) => (
                      <TableRow key={visitor._id}>
                        <TableCell>{visitor.name}</TableCell>
                        <TableCell>{visitor.email}</TableCell>
                        <TableCell>{visitor.date}</TableCell>
                        <TableCell>{visitor.purpose}</TableCell>
                        <TableCell>{visitor.host}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handlePrescheduleSelect(visitor)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPrescheduleVisitors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenPrescheduleModal(false)}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        <Modal open={openSelfCheckinModal} onClose={() => setOpenSelfCheckinModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Self Check-in History
            </Typography>
            <TextField
              fullWidth
              label="Search Visitors"
              value={searchQuery}
              onChange={(e) => handleSearch(e, "selfcheckin")}
              sx={{ mb: 2 }}
              placeholder="Search by visitor name or host name"
            />
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Check-in Time</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Host</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredSelfCheckinVisitors
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((visitor) => (
                      <TableRow key={visitor._id}>
                        <TableCell>{visitor.fullName}</TableCell>
                        <TableCell>{visitor.email}</TableCell>
                        <TableCell>
                          {new Date(visitor.checkInTime).toLocaleString()}
                        </TableCell>
                        <TableCell>{visitor.reasonForVisit}</TableCell>
                        <TableCell>{visitor.personToVisit}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSelfCheckinSelect(visitor)}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredSelfCheckinVisitors.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenSelfCheckinModal(false)}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        <Modal open={openTeamModal} onClose={handleCloseTeamModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Team Members
            </Typography>
            <Button
              startIcon={<AddCircle />}
              variant="contained"
              onClick={handleAddTeamMember}
            >
              Add Member
            </Button>
            {teamMembers.map((member, index) => (
              <Box key={index} mt={3} p={3} border={1} borderRadius={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Name"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      error={!!errors[`teamMember_${index}_name`]}
                      helperText={errors[`teamMember_${index}_name`]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Email"
                      value={member.email}
                      onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                      error={!!errors[`teamMember_${index}_email`]}
                      helperText={errors[`teamMember_${index}_email`]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      fullWidth
                      label="Document"
                      value={member.documentDetail}
                      onChange={(e) =>
                        handleTeamMemberChange(index, "documentDetail", e.target.value)
                      }
                      error={!!errors[`teamMember_${index}_documentDetail`]}
                      helperText={errors[`teamMember_${index}_documentDetail`]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="contained"
                      component="label"
                      fullWidth
                      startIcon={<UploadFile />}
                    >
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          handleTeamMemberChange(index, "document", e.target.files[0])
                        }
                        accept="image/*"
                      />
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTeamMember(index)}
                    >
                      <RemoveCircle />
                    </IconButton>
                  </Grid>
                </Grid>
                {member.document && <Typography mt={2}>{member.document.name}</Typography>}
                <TextField
                  select
                  fullWidth
                  label="Assets?"
                  value={member.hasAssets}
                  onChange={(e) => handleTeamMemberChange(index, "hasAssets", e.target.value)}
                  error={!!errors[`teamMember_${index}_hasAssets`]}
                  helperText={errors[`teamMember_${index}_hasAssets`]}
                  required
                  sx={{ mt: 3, maxWidth: 200 }}
                >
                  <MenuItem value="yes">Yes</MenuItem>
                  <MenuItem value="no">No</MenuItem>
                </TextField>
                {member.hasAssets === "yes" && (
                  <Box mt={2}>
                    {member.assets.map((asset, assetIndex) => (
                      <Grid container spacing={3} key={assetIndex} mt={1} alignItems="center">
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Type*"
                            value={asset.type}
                            onChange={(e) =>
                              handleTeamMemberAssetChange(index, assetIndex, "type", e.target.value)
                            }
                            required
                            error={!!errors[`teamMember_${index}_asset_${assetIndex}_type`]}
                            helperText={errors[`teamMember_${index}_asset_${assetIndex}_type`]}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField
                            fullWidth
                            label="Serial"
                            value={asset.serialNumber}
                            onChange={(e) =>
                              handleTeamMemberAssetChange(
                                index,
                                assetIndex,
                                "serialNumber",
                                e.target.value
                              )
                            }
                            required
                            error={
                              !!errors[`teamMember_${index}_asset_${assetIndex}_serialNumber`]
                            }
                            helperText={
                              errors[`teamMember_${index}_asset_${assetIndex}_serialNumber`]
                            }
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveTeamMemberAsset(index, assetIndex)}
                          >
                            <RemoveCircle />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Button
                      startIcon={<AddCircle />}
                      variant="outlined"
                      onClick={() => handleAddTeamMemberAsset(index)}
                      sx={{ mt: 2 }}
                    >
                      Add Asset
                    </Button>
                  </Box>
                )}
              </Box>
            ))}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseTeamModal}
              sx={{ mt: 4, display: "block", mx: "auto" }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        <Modal open={openAssetsModal} onClose={handleCloseAssetsModal}>
          <Box sx={modalStyle}>
            <Typography variant="h6" mb={2}>
              Assets
            </Typography>
            {formData.hasAssets === "yes" && (
              <Box>
                {formData.assets.map((asset, index) => (
                  <Grid container spacing={3} key={index} mt={1} alignItems="center">
                    <Grid item xs={12} sm={5}>
                      <TextField
                        fullWidth
                        label="Type"
                        value={asset.type}
                        onChange={(e) => handleAssetChange(index, "type", e.target.value)}
                        required
                        error={!!errors[`asset_${index}_type`]}
                        helperText={errors[`asset_${index}_type`]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Serial"
                        value={asset.serialNumber}
                        onChange={(e) => handleAssetChange(index, "serialNumber", e.target.value)}
                        required
                        error={!!errors[`asset_${index}_serialNumber`]}
                        helperText={errors[`asset_${index}_serialNumber`]}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <IconButton color="error" onClick={() => handleRemoveAsset(index)}>
                        <RemoveCircle />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  startIcon={<AddCircle />}
                  variant="outlined"
                  onClick={handleAddAsset}
                  sx={{ mt: 2 }}
                >
                  Add Asset
                </Button>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={handleCloseAssetsModal}
              sx={{ mt: 4, display: "block", mx: "auto" }}
            >
              Close
            </Button>
          </Box>
        </Modal>

        <Modal open={openWebcamModal} onClose={stopWebcam}>
          <Box sx={webcamModalStyle}>
            <Typography variant="h6" mb={2}>
              Capture Photo
            </Typography>
            <video ref={videoRef} autoPlay style={{ width: "100%", maxHeight: "50vh" }} />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={capturePhoto}
                sx={{ mr: 2 }}
              >
                Capture
              </Button>
              <Button variant="outlined" color="secondary" onClick={stopWebcam}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Modal>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 4, display: "block", mx: "auto" }}
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
      <Footer />
    </>
  );
};

export default Checkin;