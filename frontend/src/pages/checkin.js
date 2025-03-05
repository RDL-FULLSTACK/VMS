import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TextField, Button, Grid, Typography, MenuItem, Box, IconButton 
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const Checkin = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
  const [photo, setPhoto] = useState(null);
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
    assetQuantity: "",
    assetType: "",
    assetSerialNumber: ""
  });
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "fullName": 
        if (!value) error = "Required"; 
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Letters only";
        break;
      case "email": 
        if (!value) error = "Required"; 
        else if (!/^[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) error = "Invalid email";
        break;
      case "phoneNumber": 
        if (!value) error = "Required"; 
        else if (!/^\d{10}$/.test(value)) error = "10 digits required";
        break;
      case "designation": if (!value) error = "Required"; break;
      case "visitType": if (!value) error = "Required"; break;
      case "expectedDurationHours": 
        if (!value) error = "Required"; 
        else if (!/^\d+$/.test(value) || parseInt(value) > 23) error = "0-23 only";
        break;
      case "expectedDurationMinutes": 
        if (!value) error = "Required"; 
        else if (!/^\d+$/.test(value) || parseInt(value) > 59) error = "0-59 only";
        break;
      case "documentDetails": if (!value) error = "Required"; break;
      case "reasonForVisit": if (!value) error = "Required"; break;
      case "otp": if (!value) error = "Required"; else if (!/^\d{6}$/.test(value)) error = "6 digits"; break;
      case "visitorCompany": if (!value) error = "Required"; break;
      case "personToVisit": 
        if (!value) error = "Required"; 
        else if (!/^[A-Za-z\s]+$/.test(value)) error = "Letters only";
        break;
      case "submittedDocument": if (!value) error = "Required"; break;
      case "hasAssets": if (!value) error = "Required"; break;
      case "assetQuantity": if (formData.hasAssets === "yes" && !value) error = "Required"; break;
      case "assetType": if (formData.hasAssets === "yes" && !value) error = "Required"; break;
      case "assetSerialNumber": if (formData.hasAssets === "yes" && !value) error = "Required"; break;
      default: break;
    }
    return error;
  };

  const handleInputChange = (field, value) => {
    const sanitizedValue = field === "fullName" || field === "personToVisit" 
      ? value.replace(/[^A-Za-z\s]/g, "")
      : field === "phoneNumber" || field === "expectedDurationHours" || field === "expectedDurationMinutes" || field === "otp" || field === "assetQuantity"
      ? value.replace(/[^0-9]/g, "")
      : value;

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }));
    setErrors(prev => ({ ...prev, [field]: validateField(field, sanitizedValue) }));
  };

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "", documentDetail: "", document: null, hasAssets: "", assetQuantity: "", assetType: "", assetSerialNumber: "" }]);
  };

  const handleRemoveTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = field === "name" 
      ? value.replace(/[^A-Za-z\s]/g, "")
      : field === "email" 
      ? value.replace(/[^A-Za-z0-9._%+-@]/g, "")
      : field === "assetQuantity"
      ? value.replace(/[^0-9]/g, "")
      : value;
    setTeamMembers(updatedMembers);
  };

  const handleSubmit = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    if (!newErrors.expectedDurationHours && !newErrors.expectedDurationMinutes) {
      if (parseInt(formData.expectedDurationHours) === 0 && parseInt(formData.expectedDurationMinutes) === 0) {
        newErrors.expectedDurationHours = "Must be > 0";
        newErrors.expectedDurationMinutes = "Must be > 0";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please Fill All The Fields!");
      return;
    }

    try {
      const visitorData = {
        ...formData,
        expectedDuration: {
          hours: parseInt(formData.expectedDurationHours),
          minutes: parseInt(formData.expectedDurationMinutes)
        },
        teamMembers,
        photoUrl: photo ? photo.name : null
      };

      const response = await fetch('http://localhost:5000/api/visitors/checkin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(visitorData)
      });

      if (!response.ok) throw new Error('Submission failed');
      
      toast.success("Check-in successful!");
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (error) {
      toast.error(error.message || "Submission error");
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ width: "80%", margin: "auto", mt: 6, p: 4, borderRadius: 2, boxShadow: 3, bgcolor: "#fff" }}>
        <ToastContainer position="top-right" autoClose={3000} />
        <Typography variant="h5" align="center" fontWeight="bold" mb={4}>Visitor Check-In</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField 
              fullWidth 
              label="Full Name*" 
              value={formData.fullName} 
              onChange={(e) => handleInputChange("fullName", e.target.value)} 
              error={!!errors.fullName} 
              helperText={errors.fullName} 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth 
              label="Email*" 
              value={formData.email} 
              onChange={(e) => handleInputChange("email", e.target.value)} 
              error={!!errors.email} 
              helperText={errors.email} 
              required 
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <TextField 
                  fullWidth 
                  label="Phone Number*" 
                  value={formData.phoneNumber} 
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)} 
                  error={!!errors.phoneNumber} 
                  helperText={errors.phoneNumber} 
                  required 
                  inputProps={{ maxLength: 10 }}
                />
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="contained" color="primary">Send OTP</Button>
              </Grid>
            </Grid>
            <TextField 
              select 
              fullWidth 
              label="Designation*" 
              value={formData.designation} 
              onChange={(e) => handleInputChange("designation", e.target.value)} 
              error={!!errors.designation} 
              helperText={errors.designation} 
              required 
              sx={{ mt: 2, mb: 2 }}
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
                  label="Hours*" 
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
                  label="Minutes*" 
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
              label="Document Details*" 
              value={formData.documentDetails} 
              onChange={(e) => handleInputChange("documentDetails", e.target.value)} 
              error={!!errors.documentDetails} 
              helperText={errors.documentDetails} 
              required 
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={8}>
                <Button 
                  variant="contained" 
                  component="label" 
                  fullWidth 
                  startIcon={<UploadFile />}
                >
                  Upload Photo
                  <input type="file" hidden onChange={(e) => setPhoto(e.target.files[0])} accept="image/*" />
                </Button>
              </Grid>
              <Grid item xs={4}>
                {photo && <Typography>{photo.name}</Typography>}
              </Grid>
            </Grid>
            <TextField 
              fullWidth 
              label="Reason for Visit*" 
              value={formData.reasonForVisit} 
              onChange={(e) => handleInputChange("reasonForVisit", e.target.value)} 
              error={!!errors.reasonForVisit} 
              helperText={errors.reasonForVisit} 
              required 
              sx={{ mt: 2, mb: 2 }}
            />
            <TextField 
              fullWidth 
              label="OTP*" 
              value={formData.otp} 
              onChange={(e) => handleInputChange("otp", e.target.value)} 
              error={!!errors.otp} 
              helperText={errors.otp} 
              required 
              inputProps={{ maxLength: 6 }} 
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth 
              label="Visitor Company*" 
              value={formData.visitorCompany} 
              onChange={(e) => handleInputChange("visitorCompany", e.target.value)} 
              error={!!errors.visitorCompany} 
              helperText={errors.visitorCompany} 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              fullWidth 
              label="Person to Visit*" 
              value={formData.personToVisit} 
              onChange={(e) => handleInputChange("personToVisit", e.target.value)} 
              error={!!errors.personToVisit} 
              helperText={errors.personToVisit} 
              required 
              sx={{ mb: 2 }}
            />
            <TextField 
              select 
              fullWidth 
              label="Submitted Document*" 
              value={formData.submittedDocument} 
              onChange={(e) => handleInputChange("submittedDocument", e.target.value)} 
              error={!!errors.submittedDocument} 
              helperText={errors.submittedDocument} 
              required
            >
              <MenuItem value="ID Proof">ID Proof</MenuItem>
              <MenuItem value="Passport">Passport</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <Box mt={5}>
          <Typography variant="h6" mb={2}>Team Members</Typography>
          <Button startIcon={<AddCircle />} variant="contained" onClick={handleAddTeamMember}>Add Member</Button>
          {teamMembers.map((member, index) => (
            <Box key={index} mt={3} p={3} border={1} borderRadius={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                  <TextField 
                    fullWidth 
                    label="Name*" 
                    value={member.name} 
                    onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)} 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField 
                    fullWidth 
                    label="Email*" 
                    value={member.email} 
                    onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)} 
                    required 
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField 
                    fullWidth 
                    label="Document*" 
                    value={member.documentDetail} 
                    onChange={(e) => handleTeamMemberChange(index, "documentDetail", e.target.value)} 
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
                    <input type="file" hidden onChange={(e) => handleTeamMemberChange(index, "document", e.target.files[0])} accept="image/*" />
                  </Button>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton color="error" onClick={() => handleRemoveTeamMember(index)}><RemoveCircle /></IconButton>
                </Grid>
              </Grid>
              {member.document && <Typography mt={2}>{member.document.name}</Typography>}
              <TextField 
                select 
                fullWidth 
                label="Assets?*" 
                value={member.hasAssets} 
                onChange={(e) => handleTeamMemberChange(index, "hasAssets", e.target.value)} 
                required 
                sx={{ mt: 3, maxWidth: 200 }}
              >
                <MenuItem value="yes">Yes</MenuItem>
                <MenuItem value="no">No</MenuItem>
              </TextField>
              {member.hasAssets === "yes" && (
                <Grid container spacing={3} mt={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      fullWidth 
                      label="Quantity*" 
                      value={member.assetQuantity} 
                      onChange={(e) => handleTeamMemberChange(index, "assetQuantity", e.target.value)} 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      fullWidth 
                      label="Type*" 
                      value={member.assetType} 
                      onChange={(e) => handleTeamMemberChange(index, "assetType", e.target.value)} 
                      required 
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField 
                      fullWidth 
                      label="Serial*" 
                      value={member.assetSerialNumber} 
                      onChange={(e) => handleTeamMemberChange(index, "assetSerialNumber", e.target.value)} 
                      required 
                    />
                  </Grid>
                </Grid>
              )}
            </Box>
          ))}
        </Box>

        <Box mt={5}>
          <Typography variant="h6" mb={2}>Assets</Typography>
          <TextField 
            select 
            fullWidth 
            label="Assets?*" 
            value={formData.hasAssets} 
            onChange={(e) => handleInputChange("hasAssets", e.target.value)} 
            error={!!errors.hasAssets} 
            helperText={errors.hasAssets} 
            required 
            sx={{ maxWidth: 200, mb: 2 }}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
          {formData.hasAssets === "yes" && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Quantity*" 
                  value={formData.assetQuantity} 
                  onChange={(e) => handleInputChange("assetQuantity", e.target.value)} 
                  error={!!errors.assetQuantity} 
                  helperText={errors.assetQuantity} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Type*" 
                  value={formData.assetType} 
                  onChange={(e) => handleInputChange("assetType", e.target.value)} 
                  error={!!errors.assetType} 
                  helperText={errors.assetType} 
                  required 
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Serial*" 
                  value={formData.assetSerialNumber} 
                  onChange={(e) => handleInputChange("assetSerialNumber", e.target.value)} 
                  error={!!errors.assetSerialNumber} 
                  helperText={errors.assetSerialNumber} 
                  required 
                />
              </Grid>
            </Grid>
          )}
        </Box>

        <Button variant="contained" color="primary" sx={{ mt: 4, display: 'block', mx: 'auto' }} onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </>
  );
};

export default Checkin;