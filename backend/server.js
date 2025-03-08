require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Ensure correct path
const authRoutes = require('./src/routes/authRoutes'); // Ensure correct path
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');// Added visitor routes

const session = require("express-session");






// Initialize Express App
const app = express();
app.use(session({
    secret: "12345abc",  // Change this to a secure key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set true if using HTTPS
}));

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors()); // Enable CORS

// Connect to Database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/visitors', visitorRoutes); // Added visitor API route

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
