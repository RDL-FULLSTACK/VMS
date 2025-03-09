require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db'); // Ensure correct path
const authRoutes = require('./src/routes/authRoutes'); // Ensure correct path
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');// Added visitor routes

const session = require("express-session");
const MongoStore = require("connect-mongo"); // Store sessions in MongoDB






// Initialize Express App
const app = express();


app.use(
    session({
        secret: "1234abc", // Use a strong secret
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false, // Change to true if using HTTPS
            httpOnly: true,
            maxAge: 5 * 60 * 1000, // Session expires in 5 minutes
        },
    })
);

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow session cookies
})
); // Enable CORS

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
