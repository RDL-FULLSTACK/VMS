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
  const [photo, setPhoto] = useState(null); // Added state for photo

  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "", documentDetail: "", document: null }]);
  };

  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleEdit = (data) => {
    navigate("/editcheckin", { state: data });
  };

  const handleSubmit = () => {
    const requiredFields = document.querySelectorAll("input, select");
    let isValid = true;

    requiredFields.forEach((field) => {
      if (field.hasAttribute("required") && !field.value.trim()) {
        isValid = false;
      }
    });

    if (!isValid) {
      toast.error("Please fill in all required fields before submitting!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    toast.success("Check-in submitted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
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
        <ToastContainer />
        
        <Box display="flex" justifyContent="flex-end">
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => handleEdit({ 
              fullName: " ",  
              email: " ",
              phoneNumber: " ",
              designation: " ",
              visitType: " ",
              visitorCompany: " ",
              reasonForVisit: " ",
              expectedDuration: " ",
              submittedDocument: " ",
              teamMembers: teamMembers 
            })}
          >
            Edit
          </Button>
        </Box>

        <Typography variant="h5" align="center" fontWeight="bold" mb={2}>
          Visitor Check-In
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Full Name*" variant="outlined" margin="dense" required />
            <TextField fullWidth label="Email*" variant="outlined" margin="dense" required />
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <TextField fullWidth label="Phone Number*" variant="outlined" margin="dense" required />
              </Grid>
              <Grid item xs={4}>
                <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }}>
                  Send OTP
                </Button>
              </Grid>
            </Grid>
            <TextField fullWidth select label="Designation*" variant="outlined" margin="dense" required>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Employee">Employee</MenuItem>
              <MenuItem value="Visitor">Visitor</MenuItem>
            </TextField>
            <TextField fullWidth select label="Visit Type" variant="outlined" margin="dense" required>
              <MenuItem value="Business">Business</MenuItem>
              <MenuItem value="Personal">Personal</MenuItem>
            </TextField>
            <TextField fullWidth label="Expected Duration of Visit" variant="outlined" margin="dense" required />
            <TextField fullWidth label="Document Details" variant="outlined" margin="dense" required />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                  startIcon={<UploadFile />}
                >
                  Choose Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </Button>
              </Grid>
              <Grid item xs={4}>
                {photo && (
                  <Typography variant="body2" noWrap>
                    {photo.name}
                  </Typography>
                )}
              </Grid>
            </Grid>
            <TextField fullWidth label="Reason for Visit*" variant="outlined" margin="dense" required />
            <TextField fullWidth label="Enter OTP" variant="outlined" margin="dense" required />
            <TextField fullWidth label="Visitor Company*" variant="outlined" margin="dense" required />
            <TextField fullWidth label="Person to Visit" variant="outlined" margin="dense" required />
            <TextField fullWidth select label="Submitted Document" variant="outlined" margin="dense" required>
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

          {teamMembers.map((member, index) => (
            <Box key={index} mt={2} p={2} sx={{ border: "1px solid #ccc", borderRadius: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Full Name*"
                    variant="outlined"
                    value={member.name}
                    onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Email*"
                    variant="outlined"
                    value={member.email}
                    onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Document Details*"
                    variant="outlined"
                    value={member.documentDetail}
                    onChange={(e) => handleTeamMemberChange(index, "documentDetail", e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={2}>
                  <Button
                    variant="contained"
                    component="label"
                    fullWidth
                    startIcon={<UploadFile />}
                  >
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => handleTeamMemberChange(index, "document", e.target.files[0])}
                    />
                  </Button>
                </Grid>
                <Grid item xs={1}>
                  <IconButton color="error" onClick={() => handleRemoveTeamMember(index)}>
                    <RemoveCircle />
                  </IconButton>
                </Grid>
              </Grid>
              {member.document && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected: {member.document.name}
                </Typography>
              )}
            </Box>
          ))}
        </Box>

        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          sx={{ mt: 3 }} 
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default Checkin;