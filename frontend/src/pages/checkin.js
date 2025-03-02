import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TextField, Button, Grid, Typography, MenuItem, Box, IconButton 
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";

const Checkin = () => {
  const navigate = useNavigate();
  
  const [teamMembers, setTeamMembers] = useState([]);

  // Function to add a new team member field set
  const handleAddTeamMember = () => {
    setTeamMembers([...teamMembers, { name: "", email: "", documentDetail: "", document: null }]);
  };

  // Function to remove a team member field set
  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...teamMembers];
    updatedMembers.splice(index, 1);
    setTeamMembers(updatedMembers);
  };

  // Function to handle changes in team member input fields
  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...teamMembers];
    updatedMembers[index][field] = value;
    setTeamMembers(updatedMembers);
  };

  const handleEdit = (data) => {
    navigate("/editcheckin", { state: data });
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
          <TextField fullWidth label="Full Name*" variant="outlined" margin="dense" />
          <TextField fullWidth label="Email*" variant="outlined" margin="dense" />
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField fullWidth label="Phone Number*" variant="outlined" margin="dense" />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }}>
                Send OTP
              </Button>
            </Grid>
          </Grid>
          <TextField fullWidth select label="Designation*" variant="outlined" margin="dense">
            <MenuItem value="Manager">Manager</MenuItem>
            <MenuItem value="Employee">Employee</MenuItem>
            <MenuItem value="Visitor">Visitor</MenuItem>
          </TextField>
          <TextField fullWidth select label="Visit Type" variant="outlined" margin="dense">
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Personal">Personal</MenuItem>
          </TextField>
          <TextField fullWidth label="Expected Duration of Visit" variant="outlined" margin="dense" />
          <TextField fullWidth label="Document Details" variant="outlined" margin="dense" />
        </Grid>

        <Grid item xs={12} sm={6}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={8}>
              <TextField fullWidth label="Photo.jpg" variant="outlined" margin="dense" />
            </Grid>
            <Grid item xs={4}>
              <Button fullWidth variant="contained" color="success" sx={{ height: "100%" }}>
                Upload
              </Button>
            </Grid>
          </Grid>
          <TextField fullWidth label="Reason for Visit*" variant="outlined" margin="dense" />
          <TextField fullWidth label="Enter OTP" variant="outlined" margin="dense" />
          <TextField fullWidth label="Visitor Company*" variant="outlined" margin="dense" />
          <TextField fullWidth label="Person to Visit" variant="outlined" margin="dense" />
          <TextField fullWidth select label="Submitted Document" variant="outlined" margin="dense">
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
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Email*"
                  variant="outlined"
                  value={member.email}
                  onChange={(e) => handleTeamMemberChange(index, "email", e.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Document Details*"
                  variant="outlined"
                  value={member.documentDetail}
                  onChange={(e) => handleTeamMemberChange(index, "documentDetail", e.target.value)}
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
          </Box>
        ))}
      </Box>

      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        sx={{ mt: 3 }} 
        onClick={() => alert("Check-in submitted!")}
      >
        Submit
      </Button>
    </Box>
  );
};

export default Checkin;
