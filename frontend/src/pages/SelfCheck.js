import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { AddCircle, RemoveCircle } from "@mui/icons-material";
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

const SelfCheck = () => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);
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
    visitorCompany: "",
    personToVisit: "",
    submittedDocument: "",
    hasAssets: "",
    assets: [],
    hasTeamMembers: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [openAssetsModal, setOpenAssetsModal] = useState(false);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/users", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        const hostUsers = data.filter(
          (user) => user.role.toLowerCase() === "host"
        );
        setHosts(hostUsers);
      } catch (error) {
        console.error("Error fetching hosts:", error);
        toast.error("Failed to load hosts. Please try again later.");
      }
    };

    fetchHosts();
  }, []);

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
          field === "expectedDurationMinutes"
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

    try {
      const selfCheckData = new FormData();
      selfCheckData.append("fullName", formData.fullName);
      selfCheckData.append("email", formData.email);
      selfCheckData.append("phoneNumber", formData.phoneNumber);
      selfCheckData.append("designation", formData.designation);
      selfCheckData.append("visitType", formData.visitType);
      selfCheckData.append(
        "expectedDuration",
        JSON.stringify({
          hours: parseInt(formData.expectedDurationHours),
          minutes: parseInt(formData.expectedDurationMinutes),
        })
      );
      selfCheckData.append("documentDetails", formData.documentDetails);
      selfCheckData.append("reasonForVisit", formData.reasonForVisit);
      selfCheckData.append("visitorCompany", formData.visitorCompany);
      selfCheckData.append("personToVisit", formData.personToVisit);
      selfCheckData.append("submittedDocument", formData.submittedDocument);
      selfCheckData.append("hasAssets", formData.hasAssets);
      selfCheckData.append(
        "assets",
        formData.hasAssets === "yes" ? JSON.stringify(formData.assets) : JSON.stringify([])
      );
      selfCheckData.append("hasTeamMembers", formData.hasTeamMembers);
      selfCheckData.append(
        "teamMembers",
        formData.hasTeamMembers === "yes" ? JSON.stringify(teamMembers) : JSON.stringify([])
      );
      selfCheckData.append("department", formData.department);

      const response = await fetch("http://localhost:5000/api/self-checkins/checkin", {
        method: "POST",
        credentials: "include",
        body: selfCheckData,
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Self check-in failed");

      toast.success("Self check-in successful!");
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
        <Typography variant="h5" align="center" fontWeight="bold" mb={4}>
          Self Check-In
        </Typography>

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
            <TextField
              fullWidth
              label="Phone Number*"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber}
              required
              inputProps={{ maxLength: 10 }}
              sx={{ mb: 2 }}
            />
            <TextField
              select
              fullWidth
              label="Designation*"
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
            <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Grid item xs={12}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Team Members?*"
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
                      label="Assets?*"
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

            <TextField
              fullWidth
              label="Reason for Visit*"
              value={formData.reasonForVisit}
              onChange={(e) => handleInputChange("reasonForVisit", e.target.value)}
              error={!!errors.reasonForVisit}
              helperText={errors.reasonForVisit}
              required
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
              select
              fullWidth
              label="Person to Visit*"
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
              label="Submitted Document*"
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
              label="Department*"
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
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Name*"
                      value={member.name}
                      onChange={(e) => handleTeamMemberChange(index, "name", e.target.value)}
                      error={!!errors[`teamMember_${index}_name`]}
                      helperText={errors[`teamMember_${index}_name`]}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Email*"
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
                      label="Document*"
                      value={member.documentDetail}
                      onChange={(e) =>
                        handleTeamMemberChange(index, "documentDetail", e.target.value)
                      }
                      error={!!errors[`teamMember_${index}_documentDetail`]}
                      helperText={errors[`teamMember_${index}_documentDetail`]}
                      required
                    />
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
                <TextField
                  select
                  fullWidth
                  label="Assets?*"
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
                            label="Serial*"
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
                        label="Type*"
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

export default SelfCheck;