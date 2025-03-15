import React, { useState } from "react";
import Nav from "../components/Navbar";
import { Box, Typography, Button, MenuItem, TextField } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Footer from "../components/Footer";

const Admin2 = () => {
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div>
      <Nav />
      <div style={styles.adminContainer}>
        {!submitted ? (
          <Box style={styles.formContainer}>
            <Typography variant="h6" style={styles.title}>Status</Typography>

            <TextField
              select
              fullWidth
              variant="outlined"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              style={styles.inputField}
            >
              <MenuItem value="Available">Available</MenuItem>
              <MenuItem value="Postpone">Postpone</MenuItem>
              <MenuItem value="Cancel">Cancel</MenuItem>
            </TextField>

            <TextField
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              placeholder="Description*"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.inputField}
            />

            <Button variant="contained" style={styles.submitBtn} onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        ) : (
          <div style={styles.successContainer}>
            <CheckCircleIcon style={styles.successIcon} />
            <Typography style={styles.successText}>Successfully Submitted</Typography>
          </div>
        )}
      </div>
    <Footer/>
    </div>
  );
};

// Inline styles
const styles = {
  adminContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  formContainer: {
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    width: "350px",
    display: "flex",
    flexDirection: "column",
  },
  title: {
    fontWeight: "bold",
    marginBottom: "10px",
  },
  inputField: {
    marginBottom: "15px",
  },
  submitBtn: {
    backgroundColor: "#3f51b5",
    color: "white",
    width: "100%",
  },
  successContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  successIcon: {
    fontSize: "100px",
    color: "#2e7d32",
  },
  successText: {
    fontSize: "20px",
    fontWeight: "bold",
    marginTop: "10px",
  },
};

export default Admin2;
