import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  TextField, Button, Grid, Typography, MenuItem, Box, IconButton 
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";

const EditCheckin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get existing data or set default values
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

  // Handle form changes
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // Handle team member updates
  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  // Add a new team member
  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: "", email: "", documentDetail: "", document: null }]
    });
  };

  // Remove a team member
  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedMembers });
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
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }}>
                Send OTP
              </Button>
            </Grid>
          </Grid>
          <TextField fullWidth select label="Designation*" variant="outlined" margin="dense"
            value={formData.designation} onChange={(e) => handleChange("designation", e.target.value)}
          >
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Visitor">Visitor</MenuItem>
          </TextField>
          <TextField fullWidth select label="Visit Type" variant="outlined" margin="dense"
            value={formData.visitType} onChange={(e) => handleChange("visitType", e.target.value)}
          >
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
          </TextField>
          <TextField fullWidth label="Expected Duration of Visit" variant="outlined" margin="dense"
            value={formData.expectedDuration} onChange={(e) => handleChange("expectedDuration", e.target.value)}
          />
          <TextField fullWidth label="Document Details" variant="outlined" margin="dense"
            value={formData.documentDetails} onChange={(e) => handleChange("documentDetails", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField fullWidth label={formData.photo || "Photo.jpg"} variant="outlined" margin="dense" />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }}>
                Upload
              </Button>
            </Grid>
          </Grid>
          <TextField fullWidth label="Reason for Visit*" variant="outlined" margin="dense"
            value={formData.reasonForVisit} onChange={(e) => handleChange("reasonForVisit", e.target.value)}
          />
          <TextField fullWidth label="Enter OTP" variant="outlined" margin="dense"
            value={formData.otp} onChange={(e) => handleChange("otp", e.target.value)}
          />
          <TextField fullWidth label="Visitor Company*" variant="outlined" margin="dense"
            value={formData.visitorCompany} onChange={(e) => handleChange("visitorCompany", e.target.value)}
          />
          <TextField fullWidth label="Person to Visit" variant="outlined" margin="dense"
            value={formData.personToVisit} onChange={(e) => handleChange("personToVisit", e.target.value)}
          />
          <TextField fullWidth select label="Submitted Document" variant="outlined" margin="dense"
            value={formData.submittedDocument} onChange={(e) => handleChange("submittedDocument", e.target.value)}
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
                <Button variant="contained" component="label" fullWidth startIcon={<UploadFile />}>
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

      <Button variant="contained" color="primary" size="large" sx={{ mt: 3 }} onClick={() => navigate("/")}>
        Save Changes
      </Button>
    </Box>
  );
};

export default EditCheckin;
