import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Grid, Typography, MenuItem, Box, IconButton 
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar"; 

const EditCheckin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [photoFileName, setPhotoFileName] = useState(location.state?.photo || "No file chosen");
  const [formData, setFormData] = useState({
    fullName: location.state?.fullName || "",
    email: location.state?.email || "",
    phoneNumber: location.state?.phoneNumber || "",
    designation: location.state?.designation || "",
    visitType: location.state?.visitType || "",
    expectedDurationHours: location.state?.expectedDurationHours || "",
    expectedDurationMinutes: location.state?.expectedDurationMinutes || "",
    documentDetails: location.state?.documentDetails || "",
    photo: location.state?.photo || "",
    reasonForVisit: location.state?.reasonForVisit || "",
    otp: location.state?.otp || "",
    visitorCompany: location.state?.visitorCompany || "",
    personToVisit: location.state?.personToVisit || "",
    submittedDocument: location.state?.submittedDocument || "",
    teamMembers: location.state?.teamMembers || [] // Ensure this is always an array
  });
  const [errors, setErrors] = useState({});

  // Validation rules
  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "fullName":
        if (!value) error = "Full Name is required";
        else if (value.length > 50) error = "Maximum 50 characters allowed";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters and spaces allowed";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) 
          error = "Invalid email format";
        break;
      case "phoneNumber":
        if (!value) error = "Phone Number is required";
        else if (!/^\d{10}$/.test(value)) error = "Must be 10 digits";
        break;
      case "designation":
        if (!value) error = "Designation is required";
        break;
      case "visitType":
        if (!value) error = "Visit Type is required";
        break;
      case "expectedDurationHours":
        if (!value) error = "Hours required";
        else if (!/^\d+$/.test(value)) error = "Numbers only";
        else if (parseInt(value) < 0) error = "Cannot be negative";
        else if (parseInt(value) > 23) error = "Max 23 hours";
        break;
      case "expectedDurationMinutes":
        if (!value) error = "Minutes required";
        else if (!/^\d+$/.test(value)) error = "Numbers only";
        else if (parseInt(value) < 0) error = "Cannot be negative";
        else if (parseInt(value) > 59) error = "Max 59 minutes";
        break;
      case "documentDetails":
        if (!value) error = "Document Details required";
        else if (value.length > 100) error = "Maximum 100 characters";
        break;
      case "reasonForVisit":
        if (!value) error = "Reason is required";
        else if (value.length > 200) error = "Maximum 200 characters";
        break;
      case "otp":
        if (!value) error = "OTP is required";
        else if (!/^\d{6}$/.test(value)) error = "Must be 6 digits";
        break;
      case "visitorCompany":
        if (!value) error = "Company name is required";
        else if (value.length > 100) error = "Maximum 100 characters";
        break;
      case "personToVisit":
        if (!value) error = "Person name is required";
        else if (value.length > 50) error = "Maximum 50 characters";
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Only letters and spaces allowed";
        break;
      case "submittedDocument":
        if (!value) error = "Document type is required";
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (field, value) => {
    let sanitizedValue = value;

    switch (field) {
      case "fullName":
      case "personToVisit":
        sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
        break;
      case "phoneNumber":
      case "expectedDurationHours":
      case "expectedDurationMinutes":
      case "otp":
        sanitizedValue = value.replace(/[^0-9]/g, "");
        break;
      case "email":
        sanitizedValue = value.replace(/[^A-Za-z0-9@._-]/g, "");
        break;
      default:
        break;
    }

    setFormData({ ...formData, [field]: sanitizedValue });

    const error = validateField(field, sanitizedValue);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    let sanitizedValue = value;

    if (field === "name") {
      sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
    } else if (field === "email") {
      sanitizedValue = value.replace(/[^A-Za-z0-9@._-]/g, "");
    }

    updatedMembers[index][field] = sanitizedValue;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", email: "", documentDetail: "", document: null }]
    });
    toast.success("Team Member Added!");
  };

  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedMembers });
    toast.info("Team Member Removed!");
  };

  const handleSendOtp = () => {
    if (!formData.phoneNumber) {
      toast.error("Please enter a phone number first!");
      return;
    }
    if (errors.phoneNumber) {
      toast.error("Please enter a valid 10-digit phone number!");
      return;
    }
    toast.success("OTP sent to " + formData.phoneNumber);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFileName(file.name);
      setFormData({ ...formData, photo: file });
      toast.success(`File ${file.name} uploaded successfully!`);
    } else {
      setPhotoFileName("No file chosen");
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      toast.success(`File ${file.name} uploaded successfully!`);
    }
  };

  const handleSaveChanges = () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== "teamMembers") { // Skip teamMembers as it's an array
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
      }
    });

    if (!newErrors.expectedDurationHours && !newErrors.expectedDurationMinutes) {
      if (parseInt(formData.expectedDurationHours) === 0 && 
          parseInt(formData.expectedDurationMinutes) === 0) {
        newErrors.expectedDurationHours = "Duration must be greater than 0";
        newErrors.expectedDurationMinutes = "Duration must be greater than 0";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix all validation errors before saving!");
      return;
    }

    toast.success("Changes saved successfully!");
    setTimeout(() => navigate("/"), 1500);
  };

  return (
    <>
      <Navbar />
      <Box
        sx={{
          width: "80%",
          margin: "auto",
          mt: 4,
          p: 3,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "#f8f9fa",
        }}
      >
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />

        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          Edit Visitor Check-In
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Full Name*" 
              variant="outlined" 
              margin="dense" 
              required
              value={formData.fullName} 
              onChange={(e) => handleChange("fullName", e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <TextField 
              fullWidth 
              label="Email*" 
              variant="outlined" 
              margin="dense" 
              required
              value={formData.email} 
              onChange={(e) => handleChange("email", e.target.value)}
              error={!!errors.email}
              helperText={errors.email || "example@domain.com"}
            />
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <TextField 
                  fullWidth 
                  label="Phone Number*" 
                  variant="outlined" 
                  margin="dense" 
                  required
                  value={formData.phoneNumber} 
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber || "10 digits required"}
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  sx={{ height: "100%" }} 
                  onClick={handleSendOtp}
                >
                  Send OTP
                </Button>
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              select 
              label="Designation*" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.designation} 
              onChange={(e) => handleChange("designation", e.target.value)}
              error={!!errors.designation}
              helperText={errors.designation}
            >
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Visitor">Visitor</MenuItem>
            </TextField>
            <TextField 
              fullWidth 
              select 
              label="Visit Type" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.visitType} 
              onChange={(e) => handleChange("visitType", e.target.value)}
              error={!!errors.visitType}
              helperText={errors.visitType}
            >
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
            </TextField>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Hours*" 
                  variant="outlined" 
                  margin="dense"
                  required
                  value={formData.expectedDurationHours} 
                  onChange={(e) => handleChange("expectedDurationHours", e.target.value)}
                  error={!!errors.expectedDurationHours}
                  helperText={errors.expectedDurationHours || "0-23"}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField 
                  fullWidth 
                  label="Minutes*" 
                  variant="outlined" 
                  margin="dense"
                  required
                  value={formData.expectedDurationMinutes} 
                  onChange={(e) => handleChange("expectedDurationMinutes", e.target.value)}
                  error={!!errors.expectedDurationMinutes}
                  helperText={errors.expectedDurationMinutes || "0-59"}
                  inputProps={{ maxLength: 2 }}
                />
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              label="Document Details" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.documentDetails} 
              onChange={(e) => handleChange("documentDetails", e.target.value)}
              error={!!errors.documentDetails}
              helperText={errors.documentDetails}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  label="Photo"
                  variant="outlined"
                  margin="dense"
                  value={photoFileName}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  color="success" 
                  sx={{ height: "100%" }} 
                  component="label"
                >
                  Choose File
                  <input 
                    type="file" 
                    hidden 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                  />
                </Button>
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              label="Reason for Visit*" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.reasonForVisit} 
              onChange={(e) => handleChange("reasonForVisit", e.target.value)}
              error={!!errors.reasonForVisit}
              helperText={errors.reasonForVisit}
            />
            <TextField 
              fullWidth 
              label="Enter OTP" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.otp} 
              onChange={(e) => handleChange("otp", e.target.value)}
              error={!!errors.otp}
              helperText={errors.otp || "6 digits required"}
              inputProps={{ maxLength: 6 }}
            />
            <TextField 
              fullWidth 
              label="Visitor Company*" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.visitorCompany} 
              onChange={(e) => handleChange("visitorCompany", e.target.value)}
              error={!!errors.visitorCompany}
              helperText={errors.visitorCompany}
            />
            <TextField 
              fullWidth 
              label="Person to Visit" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.personToVisit} 
              onChange={(e) => handleChange("personToVisit", e.target.value)}
              error={!!errors.personToVisit}
              helperText={errors.personToVisit}
            />
            <TextField 
              fullWidth 
              select 
              label="Submitted Document" 
              variant="outlined" 
              margin="dense"
              required
              value={formData.submittedDocument} 
              onChange={(e) => handleChange("submittedDocument", e.target.value)}
              error={!!errors.submittedDocument}
              helperText={errors.submittedDocument}
            >
              <MenuItem value="ID Proof">ID Proof</MenuItem>
              <MenuItem value="Passport">Passport</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Team Members
          </Typography>

          <Button 
            startIcon={<AddCircle />} 
            variant="contained" 
            color="primary" 
            onClick={handleAddTeamMember}
          >
            Add Team Member
          </Button>

          {formData.teamMembers && formData.teamMembers.map((member, index) => (
            <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField 
                    fullWidth 
                    label="Full Name*" 
                    variant="outlined"
                    required
                    value={member.name} 
                    onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                    error={!member.name}
                    helperText={!member.name && "Required"}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField 
                    fullWidth 
                    label="Email*" 
                    variant="outlined"
                    required
                    value={member.email} 
                    onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                    error={!member.email || !/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(member.email)}
                    helperText={!member.email ? "Required" : (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(member.email) && "Invalid email")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField 
                    fullWidth 
                    label="Document Details*" 
                    variant="outlined"
                    required
                    value={member.documentDetail} 
                    onChange={(e) => handleTeamMemberChange(index, "documentDetail", e.target.value)}
                    error={!member.documentDetail}
                    helperText={!member.documentDetail && "Required"}
                  />
                </Grid>
                <Grid item xs={2}>
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
                      onChange={handleUpload} 
                    />
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <IconButton 
                    color="error" 
                    onClick={() => handleRemoveTeamMember(index)}
                  >
                    <RemoveCircle />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ mt: 3 }} 
          onClick={handleSaveChanges}
        >
          Save Changes
        </Button>
      </Box>
    </>
  );
};

export default EditCheckin;