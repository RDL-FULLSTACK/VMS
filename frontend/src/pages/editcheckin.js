import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Grid, Typography, MenuItem, Box, IconButton 
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditCheckin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(location.state || {
    fullName: "",
    email: "",
    phoneNumber: "",
    designation: "",
    visitType: "",
    expectedDuration: "",
    documentDetails: "",
    photo: "",
    reasonForVisit: "",
    otp: "",
    visitorCompany: "",
    personToVisit: "",
    submittedDocument: "",
    teamMembers: []
  });

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
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

  const handleSaveChanges = () => {
    toast.success("Changes saved successfully!");
    navigate("/");
  };

  const handleSendOtp = () => {
    toast.success("OTP Sent!");
  };

  const handleUpload = () => {
    toast.success("File Uploaded Successfully!");
  };

  return (
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
      <ToastContainer position="top-right" autoClose={3000} />

      <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
        Edit Visitor Check-In
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label="Full Name*" variant="outlined" margin="dense" 
            value={formData.fullName} onChange={(e) => handleChange("fullName", e.target.value)}
          />
          <TextField fullWidth label="Email*" variant="outlined" margin="dense" 
            value={formData.email} onChange={(e) => handleChange("email", e.target.value)}
          />
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField fullWidth label="Phone Number*" variant="outlined" margin="dense" 
                value={formData.phoneNumber} onChange={(e) => handleChange("phoneNumber", e.target.value)}
              />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }} onClick={handleSendOtp}>
                Send OTP
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField fullWidth label={formData.photo || "Photo.jpg"} variant="outlined" margin="dense" />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }} onClick={handleUpload}>
                Upload
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Box mt={3}>
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Team Members
        </Typography>

        <Button startIcon={<AddCircle />} variant="contained" color="primary" onClick={handleAddTeamMember}>
          Add Team Member
        </Button>

        {formData.teamMembers.map((member, index) => (
          <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <TextField fullWidth label="Full Name*" variant="outlined"
                  value={member.name} onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Email*" variant="outlined"
                  value={member.email} onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField fullWidth label="Document Details*" variant="outlined"
                  value={member.documentDetail} onChange={(e) => handleTeamMemberChange(index, "documentDetail", e.target.value)}
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="contained" component="label" fullWidth startIcon={<UploadFile />} onClick={handleUpload}>
                  Upload
                  <input type="file" hidden />
                </Button>
              </Grid>
              <Grid item xs={1}>
                <IconButton color="error" onClick={() => handleRemoveTeamMember(index)}>
                  <RemoveCircle />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        ))}
      </Box>

      <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }} onClick={handleSaveChanges}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditCheckin;
