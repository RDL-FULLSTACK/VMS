import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Grid,
  Typography,
  MenuItem,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { AddCircle, RemoveCircle, UploadFile } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const EditCheckin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const visitorId = location.pathname.split("/").pop(); // Get the visitor ID from the URL

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
    reasonForVisit: location.state?.reasonForVisit || "",
    otp: location.state?.otp || "",
    visitorCompany: location.state?.visitorCompany || "",
    personToVisit: location.state?.personToVisit || "",
    submittedDocument: location.state?.submittedDocument || "",
    hasAssets: location.state?.hasAssets || "",
    assets: location.state?.assets || [], // Array for multiple assets
    teamMembers: location.state?.teamMembers || [] // Ensure this is always an array
  });
  const [errors, setErrors] = useState({});
  const [openTeamPopup, setOpenTeamPopup] = useState(false);
  const [openAssetsPopup, setOpenAssetsPopup] = useState(false);

  // Fetch visitor data
  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}`);
        if (!response.ok) throw new Error("Failed to fetch visitor data");
        const data = await response.json();
        setFormData(data.data); // Set the form data with fetched visitor data
        setPhotoFileName(data.data.photoUrl || "No file chosen"); // Set photo file name if available
      } catch (error) {
        console.error("Error fetching visitor data:", error);
        toast.error("Failed to load visitor data.");
      }
    };

    fetchVisitorData();
  }, [visitorId]);

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
      case "visitType":
      case "documentDetails":
      case "reasonForVisit":
      case "visitorCompany":
      case "personToVisit":
      case "submittedDocument":
      case "hasAssets":
        if (!value) error = "Required";
        break;
      case "expectedDurationHours":
        if (!value) error = "Hours required";
        else if (!/^\d+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 23)
          error = "Must be between 0 and 23";
        break;
      case "expectedDurationMinutes":
        if (!value) error = "Minutes required";
        else if (!/^\d+$/.test(value) || parseInt(value) < 0 || parseInt(value) > 59)
          error = "Must be between 0 and 59";
        break;
      case "otp":
        if (!value) error = "OTP is required";
        else if (!/^\d{6}$/.test(value)) error = "Must be 6 digits";
        break;
      default:
        break;
    }
    return error;
  };

  const validateAssetField = (asset, field) => {
    let error = "";
    if (!asset[field]) error = "Required";
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
      case "hasAssets":
        sanitizedValue = value;
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

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...formData.assets];
    updatedAssets[index][field] = field === "quantity" ? value.replace(/[^0-9]/g, "") : value;
    setFormData(prev => ({ ...prev, assets: updatedAssets }));
  };

  const handleAddAsset = () => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, { quantity: "", type: "", serialNumber: "" }]
    }));
  };

  const handleRemoveAsset = (index) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    let sanitizedValue = value;

    switch (field) {
      case "name":
        sanitizedValue = value.replace(/[^A-Za-z\s]/g, "");
        break;
      case "email":
        sanitizedValue = value.replace(/[^A-Za-z0-9@._-]/g, "");
        break;
      case "hasAssets":
      case "documentDetail":
        sanitizedValue = value;
        break;
      case "document":
        sanitizedValue = value;
        break;
      default:
        break;
    }

    updatedMembers[index][field] = sanitizedValue;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleTeamMemberAssetChange = (memberIndex, assetIndex, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[memberIndex].assets[assetIndex][field] = field === "quantity" ? value.replace(/[^0-9]/g, "") : value;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleAddTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, {
        name: "",
        email: "",
        documentDetail: "",
        document: null,
        hasAssets: "",
        assets: [] // Array for multiple assets
      }]
    });
    toast.success("Team Member Added!");
  };

  const handleRemoveTeamMember = (index) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers.splice(index, 1);
    setFormData({ ...formData, teamMembers: updatedMembers });
    toast.info("Team Member Removed!");
  };

  const handleAddTeamMemberAsset = (index) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index].assets.push({ quantity: "", type: "", serialNumber: "" });
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const handleRemoveTeamMemberAsset = (memberIndex, assetIndex) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[memberIndex].assets = updatedMembers[memberIndex].assets.filter((_, i) => i !== assetIndex);
    setFormData({ ...formData, teamMembers: updatedMembers });
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
      const response = await fetch('http://localhost:5000/api/visitors/send-email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });

      if (!response.ok) throw new Error('Failed to send OTP');

      toast.success(`OTP sent to ${formData.email}!`);
    } catch (error) {
      toast.error(error.message || "Error sending OTP");
    }
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

  const handleSaveChanges = async () => {
    const newErrors = {};
    Object.keys(formData).forEach(field => {
      if (field !== "teamMembers" && field !== "assets") { // Skip arrays
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

    if (formData.hasAssets === "yes" && formData.assets.length === 0) {
      newErrors.assets = "At least one asset is required";
    } else if (formData.hasAssets === "yes") {
      formData.assets.forEach((asset, index) => {
        ["quantity", "type", "serialNumber"].forEach(field => {
          const error = validateAssetField(asset, field);
          if (error) newErrors[`asset_${index}_${field}`] = error;
        });
      });
    }

    formData.teamMembers.forEach((member, memberIndex) => {
      if (member.hasAssets === "yes" && member.assets.length === 0) {
        newErrors[`teamMember_${memberIndex}_assets`] = "At least one asset is required";
      } else if (member.hasAssets === "yes") {
        member.assets.forEach((asset, assetIndex) => {
          ["quantity", "type", "serialNumber"].forEach(field => {
            const error = validateAssetField(asset, field);
            if (error) newErrors[`teamMember_${memberIndex}_asset_${assetIndex}_${field}`] = error;
          });
        });
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Please fix all validation errors before saving!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/visitors/${visitorId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to update visitor");

      toast.success("Visitor details updated successfully!");
      navigate("/visitorlist"); // Redirect to visitor list after successful update
    } catch (error) {
      toast.error(error.message || "Error updating visitor");
    }
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
        <ToastContainer position="top-right" autoClose={3000} />
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
              helperText={errors.email}
            />
            <TextField
              fullWidth
              label="Phone Number*"
              variant="outlined"
              margin="dense"
              required
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              inputProps={{ maxLength: 10 }}
            />
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
              label="Visit Type*"
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
                  label="Expected Duration Hours*"
                  variant="outlined"
                  margin="dense"
                  required
                  value={formData.expectedDurationHours}
                  onChange={(e) => handleChange("expectedDurationHours", e.target.value)}
                  error={!!errors.expectedDurationHours}
                  helperText={errors.expectedDurationHours}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expected Duration Minutes*"
                  variant="outlined"
                  margin="dense"
                  required
                  value={formData.expectedDurationMinutes}
                  onChange={(e) => handleChange("expectedDurationMinutes", e.target.value)}
                  error={!!errors.expectedDurationMinutes}
                  helperText={errors.expectedDurationMinutes}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label="Document Details*"
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
              label="Enter OTP*"
              variant="outlined"
              margin="dense"
              required
              value={formData.otp}
              onChange={(e) => handleChange("otp", e.target.value)}
              error={!!errors.otp}
              helperText={errors.otp}
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
              label="Person to Visit*"
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
              label="Submitted Document*"
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
            <Box>
              <Box mt={2} display="flex" justifyContent="flex-start" alignItems="center" gap={4} mb={5}>
                <Button startIcon={<AddCircle />} variant="contained" onClick={() => setOpenTeamPopup(true)}>
                  Add Member
                </Button>
                <Button variant="contained" onClick={() => setOpenAssetsPopup(true)}>
                  Manage Assets
                </Button>
              </Box>

              {/* Add Member Dialog */}
              <Dialog open={openTeamPopup} onClose={() => setOpenTeamPopup(false)} fullWidth maxWidth="md">
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogContent>
                  {formData.teamMembers.map((member, index) => (
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
                            <input
                              type="file"
                              hidden
                              onChange={(e) => handleTeamMemberChange(index, "document", e.target.files[0])}
                              accept="image/*"
                            />
                          </Button>
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton color="error" onClick={() => handleRemoveTeamMember(index)}>
                            <RemoveCircle />
                          </IconButton>
                        </Grid>
                      </Grid>

                      {/* Team Member Assets Section */}
                      <Box mt={2}>
                        <TextField
                          fullWidth
                          select
                          label="Bringing Assets?*"
                          variant="outlined"
                          margin="dense"
                          required
                          value={member.hasAssets}
                          onChange={(e) => handleTeamMemberChange(index, "hasAssets", e.target.value)}
                          sx={{ maxWidth: 200 }}
                        >
                          <MenuItem value="yes">Yes</MenuItem>
                          <MenuItem value="no">No</MenuItem>
                        </TextField>

                        {member.hasAssets === "yes" && (
                          <Box mt={2}>
                            {member.assets.map((asset, assetIndex) => (
                              <Grid container spacing={2} key={assetIndex} mt={1} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Quantity*"
                                    variant="outlined"
                                    margin="dense"
                                    required
                                    value={asset.quantity}
                                    onChange={(e) => handleTeamMemberAssetChange(index, assetIndex, "quantity", e.target.value)}
                                    error={!!errors[`teamMember_${index}_asset_${assetIndex}_quantity`]}
                                    helperText={errors[`teamMember_${index}_asset_${assetIndex}_quantity`]}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Type*"
                                    variant="outlined"
                                    margin="dense"
                                    required
                                    value={asset.type}
                                    onChange={(e) => handleTeamMemberAssetChange(index, assetIndex, "type", e.target.value)}
                                    error={!!errors[`teamMember_${index}_asset_${assetIndex}_type`]}
                                    helperText={errors[`teamMember_${index}_asset_${assetIndex}_type`]}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <TextField
                                    fullWidth
                                    label="Serial Number*"
                                    variant="outlined"
                                    margin="dense"
                                    required
                                    value={asset.serialNumber}
                                    onChange={(e) => handleTeamMemberAssetChange(index, assetIndex, "serialNumber", e.target.value)}
                                    error={!!errors[`teamMember_${index}_asset_${assetIndex}_serialNumber`]}
                                    helperText={errors[`teamMember_${index}_asset_${assetIndex}_serialNumber`]}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={1}>
                                  <IconButton color="error" onClick={() => handleRemoveTeamMemberAsset(index, assetIndex)}>
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
                    </Box>
                  ))}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenTeamPopup(false)}>Close</Button>
                  <Button onClick={handleAddTeamMember} variant="contained">Add Member</Button>
                </DialogActions>
              </Dialog>

              {/* Manage Assets Dialog */}
              <Dialog open={openAssetsPopup} onClose={() => setOpenAssetsPopup(false)} fullWidth maxWidth="md">
                <DialogTitle>Manage Assets</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    select
                    label="Assets?*"
                    value={formData.hasAssets}
                    onChange={(e) => handleChange("hasAssets", e.target.value)}
                    error={!!errors.hasAssets}
                    helperText={errors.hasAssets}
                    required
                    sx={{ maxWidth: 200, mb: 2 }}
                  >
                    <MenuItem value="yes">Yes</MenuItem>
                    <MenuItem value="no">No</MenuItem>
                  </TextField>
                  {formData.hasAssets === "yes" && (
                    <Box>
                      {formData.assets.map((asset, index) => (
                        <Grid container spacing={3} key={index} mt={1} alignItems="center">
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Quantity*"
                              value={asset.quantity}
                              onChange={(e) => handleAssetChange(index, "quantity", e.target.value)}
                              required
                              error={!!errors[`asset_${index}_quantity`]}
                              helperText={errors[`asset_${index}_quantity`]}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Type*"
                              value={asset.type}
                              onChange={(e) => handleAssetChange(index, "type", e.target.value)}
                              required
                              error={!!errors[`asset_${index}_type`]}
                              helperText={errors[`asset_${index}_type`]}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              label="Serial*"
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
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpenAssetsPopup(false)}>Close</Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Grid>
        </Grid>

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