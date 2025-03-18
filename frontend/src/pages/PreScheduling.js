import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

const toastStyles = `
  .custom-toast {
    font-size: 18px;
    padding: 20px 30px;
    min-width: 400px;
    border-radius: 8px;
    line-height: 1.5;
  }
  .custom-toast .Toastify__toast-body {
    white-space: pre-line;
  }
`;

const PreScheduling = () => {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    purpose: "",
    host: "",
    email: "",
    department: "",
    phoneNumber: "",
    designation: "",
    visitType: "",
    expectedDuration: { hours: "", minutes: "" },
    hasAssets: "",
    assets: [],
    teamMembers: [],
  });
  const [loading, setLoading] = useState(false);
  const [fetchingHosts, setFetchingHosts] = useState(true);
  const [errors, setErrors] = useState({});
  const [hosts, setHosts] = useState([]);
  const [openTeamModal, setOpenTeamModal] = useState(false);
  const [openAssetsModal, setOpenAssetsModal] = useState(false);

  useEffect(() => {
    const fetchHosts = async () => {
      try {
        setFetchingHosts(true);
        const hostUsers = (
          await axios.get("http://localhost:5000/api/users", {
            withCredentials: true,
          })
        ).data.filter((user) => user.role.toLowerCase() === "host");
        setHosts(hostUsers);
        setFetchingHosts(false);
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          host: "Failed to load hosts. Please try again later.",
        }));
        setFetchingHosts(false);
      }
    };
    fetchHosts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue =
      name === "name"
        ? value.replace(/[^A-Za-z\s]/g, "")
        : name === "phoneNumber" || name === "hours" || name === "minutes"
        ? value.replace(/[^0-9]/g, "")
        : value;

    if (name === "hours" || name === "minutes") {
      setFormData((prev) => ({
        ...prev,
        expectedDuration: { ...prev.expectedDuration, [name]: sanitizedValue },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: sanitizedValue }));
    }

    let error = "";
    if (name === "name" && value === "") error = "Name is required";
    if (name === "date" && value === "") error = "Date is required";
    if (name === "purpose" && value === "") error = "Purpose is required";
    if (name === "host" && value === "") error = "Host is required";
    if (name === "email" && value === "") error = "Email is required";
    else if (name === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      error = "Invalid email format";
    if (name === "department" && value === "") error = "Department is required";
    if (name === "phoneNumber" && value === "") error = "Phone number is required";
    else if (name === "phoneNumber" && !/^\d{10}$/.test(value))
      error = "10 digits required";
    if (name === "designation" && value === "") error = "Designation is required";
    if (name === "visitType" && value === "") error = "Visit type is required";
    if (name === "hours" && value === "") error = "Hours are required";
    else if (name === "hours" && (!/^\d+$/.test(value) || parseInt(value) > 23 || parseInt(value) < 0))
      error = "0-23 only";
    if (name === "minutes" && value === "") error = "Minutes are required";
    else if (name === "minutes" && (!/^\d+$/.test(value) || parseInt(value) > 59 || parseInt(value) < 0))
      error = "0-59 only";
    if (name === "hasAssets" && value === "") error = "Required";

    setErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "hasAssets" && sanitizedValue === "yes") {
      setOpenAssetsModal(true);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name === "") newErrors.name = "Name is required";
    if (formData.date === "") newErrors.date = "Date is required";
    if (formData.purpose === "") newErrors.purpose = "Purpose is required";
    if (formData.host === "") newErrors.host = "Host is required";
    if (formData.email === "") newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (formData.department === "") newErrors.department = "Department is required";
    if (formData.phoneNumber === "") newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = "10 digits required";
    if (formData.designation === "") newErrors.designation = "Designation is required";
    if (formData.visitType === "") newErrors.visitType = "Visit type is required";
    if (formData.expectedDuration.hours === "")
      newErrors.hours = "Hours are required";
    else if (
      !/^\d+$/.test(formData.expectedDuration.hours) ||
      parseInt(formData.expectedDuration.hours) > 23 ||
      parseInt(formData.expectedDuration.hours) < 0
    )
      newErrors.hours = "0-23 only";
    if (formData.expectedDuration.minutes === "")
      newErrors.minutes = "Minutes are required";
    else if (
      !/^\d+$/.test(formData.expectedDuration.minutes) ||
      parseInt(formData.expectedDuration.minutes) > 59 ||
      parseInt(formData.expectedDuration.minutes) < 0
    )
      newErrors.minutes = "0-59 only";
    if (formData.hasAssets === "") newErrors.hasAssets = "Required";
    if (formData.hasAssets === "yes" && formData.assets.length === 0)
      newErrors.assets = "At least one asset is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...formData.assets];
    updatedAssets[index][field] = value;
    if (field === "quantity") updatedAssets[index][field] = parseInt(value) || "";
    setFormData((prev) => ({ ...prev, assets: updatedAssets }));
  };

  const handleAddAsset = () => {
    setFormData((prev) => ({
      ...prev,
      assets: [...prev.assets, { quantity: "", type: "", serialNumber: "" }],
    }));
  };

  const handleRemoveAsset = (index) => {
    setFormData((prev) => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index),
    }));
  };

  const handleAddTeamMember = () => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: "",
          email: "",
          documentDetail: "",
          documentUrl: "",
          hasAssets: "",
          assets: [],
        },
      ],
    }));
  };

  const handleRemoveTeamMember = (index) => {
    setFormData((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index),
    }));
  };

  const handleTeamMemberChange = (index, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] =
      field === "name"
        ? value.replace(/[^A-Za-z\s]/g, "")
        : field === "email"
        ? value.replace(/[^A-Za-z0-9._%+-@]/g, "")
        : value;
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleTeamMemberAssetChange = (memberIndex, assetIndex, field, value) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[memberIndex].assets[assetIndex][field] = value;
    if (field === "quantity")
      updatedMembers[memberIndex].assets[assetIndex][field] = parseInt(value) || "";
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleAddTeamMemberAsset = (index) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index].assets.push({ quantity: "", type: "", serialNumber: "" });
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleRemoveTeamMemberAsset = (memberIndex, assetIndex) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[memberIndex].assets = updatedMembers[memberIndex].assets.filter(
      (_, i) => i !== assetIndex
    );
    setFormData((prev) => ({ ...prev, teamMembers: updatedMembers }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const selectedHost = hosts.find((h) => h._id === formData.host)?.username;
      if (!selectedHost) throw new Error("Selected host not found");

      const payload = {
        name: formData.name,
        date: formData.date,
        purpose: formData.purpose,
        host: selectedHost,
        email: formData.email,
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        designation: formData.designation,
        visitType: formData.visitType,
        expectedDuration: {
          hours: parseInt(formData.expectedDuration.hours),
          minutes: parseInt(formData.expectedDuration.minutes),
        },
        hasAssets: formData.hasAssets,
        assets: formData.hasAssets === "yes" ? formData.assets : [],
        teamMembers: formData.teamMembers,
      };

      // Removed unused 'response' variable
      await axios.post("http://localhost:5000/api/preschedule", payload, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast.success(
        `Form submitted!\nName: ${formData.name}\nDate: ${formData.date}\nPurpose: ${formData.purpose}\nHost: ${selectedHost}\nEmail: ${formData.email}\nDepartment: ${formData.department}\nPhone: ${formData.phoneNumber}\nDesignation: ${formData.designation}\nVisit Type: ${formData.visitType}\nDuration: ${formData.expectedDuration.hours}h ${formData.expectedDuration.minutes}m\nAssets: ${formData.hasAssets}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: "custom-toast",
        }
      );

      setFormData({
        name: "",
        date: "",
        purpose: "",
        host: "",
        email: "",
        department: "",
        phoneNumber: "",
        designation: "",
        visitType: "",
        expectedDuration: { hours: "", minutes: "" },
        hasAssets: "",
        assets: [],
        teamMembers: [],
      });
      setErrors({});
    } catch (error) {
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
        className: "custom-toast",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseTeamModal = () => setOpenTeamModal(false);
  const handleCloseAssetsModal = () => setOpenAssetsModal(false);
  const handleViewTeamMembers = () => setOpenTeamModal(true);
  const handleViewAssets = () => setOpenAssetsModal(true);

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
          toastClassName="custom-toast"
        />
        <Typography variant="h5" align="center" fontWeight="bold" mb={4}>
          Pre-Scheduling & Approval
        </Typography>

        {fetchingHosts ? (
          <Typography align="center">Loading hosts...</Typography>
        ) : hosts.length === 0 ? (
          <Typography align="center" color="error">
            No hosts available. Please try again later.
          </Typography>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name*"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email*"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number*"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  required
                  disabled={loading}
                  inputProps={{ maxLength: 10 }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Designation*"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  error={!!errors.designation}
                  helperText={errors.designation}
                  required
                  disabled={loading}
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
                  name="visitType"
                  value={formData.visitType}
                  onChange={handleChange}
                  error={!!errors.visitType}
                  helperText={errors.visitType}
                  required
                  disabled={loading}
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
                      name="hours"
                      value={formData.expectedDuration.hours}
                      onChange={handleChange}
                      error={!!errors.hours}
                      helperText={errors.hours}
                      required
                      disabled={loading}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Minutes*"
                      name="minutes"
                      value={formData.expectedDuration.minutes}
                      onChange={handleChange}
                      error={!!errors.minutes}
                      helperText={errors.minutes}
                      required
                      disabled={loading}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Purpose*"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleChange}
                  error={!!errors.purpose}
                  helperText={errors.purpose}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                />
                <TextField
                  select
                  fullWidth
                  label="Host*"
                  name="host"
                  value={formData.host}
                  onChange={handleChange}
                  error={!!errors.host}
                  helperText={errors.host}
                  required
                  disabled={loading || hosts.length === 0}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="" disabled>
                    Select Host
                  </MenuItem>
                  {hosts.map((host) => (
                    <MenuItem key={host._id} value={host._id}>
                      {host.username}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  fullWidth
                  label="Department*"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  error={!!errors.department}
                  helperText={errors.department}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
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
                <TextField
                  fullWidth
                  label="Date*"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  error={!!errors.date}
                  helperText={errors.date}
                  required
                  disabled={loading}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                  sx={{ mb: 2 }}
                />
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs={6}>
                    <TextField
                      select
                      fullWidth
                      label="Assets?*"
                      name="hasAssets"
                      value={formData.hasAssets}
                      onChange={handleChange}
                      error={!!errors.hasAssets}
                      helperText={errors.hasAssets}
                      required
                      disabled={loading}
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
                        disabled={loading}
                      >
                        View
                      </Button>
                    )}
                  </Grid>
                </Grid>
                <Button
                  variant="outlined"
                  onClick={handleViewTeamMembers}
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  Add Team Members
                </Button>
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
                  disabled={loading}
                >
                  Add Member
                </Button>
                {formData.teamMembers.map((member, index) => (
                  <Box key={index} mt={3} p={3} border={1} borderRadius={2}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Name*"
                          value={member.name}
                          onChange={(e) =>
                            handleTeamMemberChange(index, "name", e.target.value)
                          }
                          required
                          disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Email*"
                          value={member.email}
                          onChange={(e) =>
                            handleTeamMemberChange(index, "email", e.target.value)
                          }
                          required
                          disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <TextField
                          fullWidth
                          label="Document Detail*"
                          value={member.documentDetail}
                          onChange={(e) =>
                            handleTeamMemberChange(index, "documentDetail", e.target.value)
                          }
                          required
                          disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2}>
                        <TextField
                          fullWidth
                          label="Document URL"
                          value={member.documentUrl}
                          onChange={(e) =>
                            handleTeamMemberChange(index, "documentUrl", e.target.value)
                          }
                          disabled={loading}
                        />
                      </Grid>
                      <Grid item xs={12} sm={1}>
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveTeamMember(index)}
                          disabled={loading}
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
                      onChange={(e) =>
                        handleTeamMemberChange(index, "hasAssets", e.target.value)
                      }
                      required
                      disabled={loading}
                      sx={{ mt: 3, maxWidth: 200 }}
                    >
                      <MenuItem value="yes">Yes</MenuItem>
                      <MenuItem value="no">No</MenuItem>
                    </TextField>
                    {member.hasAssets === "yes" && (
                      <Box mt={2}>
                        {member.assets.map((asset, assetIndex) => (
                          <Grid
                            container
                            spacing={3}
                            key={assetIndex}
                            mt={1}
                            alignItems="center"
                          >
                            <Grid item xs={12} sm={2}>
                              <TextField
                                fullWidth
                                label="Quantity*"
                                value={asset.quantity}
                                onChange={(e) =>
                                  handleTeamMemberAssetChange(
                                    index,
                                    assetIndex,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                                required
                                disabled={loading}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Type*"
                                value={asset.type}
                                onChange={(e) =>
                                  handleTeamMemberAssetChange(
                                    index,
                                    assetIndex,
                                    "type",
                                    e.target.value
                                  )
                                }
                                required
                                disabled={loading}
                              />
                            </Grid>
                            <Grid item xs={12} sm={5}>
                              <TextField
                                fullWidth
                                label="Serial Number*"
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
                                disabled={loading}
                              />
                            </Grid>
                            <Grid item xs={12} sm={1}>
                              <IconButton
                                color="error"
                                onClick={() =>
                                  handleRemoveTeamMemberAsset(index, assetIndex)
                                }
                                disabled={loading}
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
                          disabled={loading}
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
                  disabled={loading}
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
                      <Grid
                        container
                        spacing={3}
                        key={index}
                        mt={1}
                        alignItems="center"
                      >
                        <Grid item xs={12} sm={2}>
                          <TextField
                            fullWidth
                            label="Quantity*"
                            value={asset.quantity}
                            onChange={(e) =>
                              handleAssetChange(index, "quantity", e.target.value)
                            }
                            required
                            disabled={loading}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <TextField
                            fullWidth
                            label="Type*"
                            value={asset.type}
                            onChange={(e) =>
                              handleAssetChange(index, "type", e.target.value)
                            }
                            required
                            disabled={loading}
                          />
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <TextField
                            fullWidth
                            label="Serial Number*"
                            value={asset.serialNumber}
                            onChange={(e) =>
                              handleAssetChange(index, "serialNumber", e.target.value)
                            }
                            required
                            disabled={loading}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1}>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAsset(index)}
                            disabled={loading}
                          >
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
                      disabled={loading}
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
                  disabled={loading}
                >
                  Close
                </Button>
              </Box>
            </Modal>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || hosts.length === 0}
              sx={{ mt: 4, display: "block", mx: "auto" }}
            >
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </form>
        )}
      </Box>
      <style>{toastStyles}</style>
    </>
  );
};

export default PreScheduling;