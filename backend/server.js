require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Ensure correct path
const authRoutes = require('./src/routes/authRoutes'); // Ensure correct path

// Initialize Express App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
