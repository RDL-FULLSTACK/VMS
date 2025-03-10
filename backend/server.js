require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const authRoutes = require('./src/routes/authRoutes');
const vehicleRoutes = require('./src/routes/vehicleRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');
const preScheduleRoutes = require('./src/routes/preScheduleRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Initialize Express App
const app = express();

// Session configuration
app.use(
    session({
        secret: process.env.SESSION_SECRET, // Moved to .env
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI // Use MongoDB URI from .env
        }),
        cookie: {
            secure: process.env.NODE_ENV === 'production', // Secure in production
            httpOnly: true,
            maxAge: 5 * 60 * 1000, // 5 minutes
        },
    })
);

// Middleware
app.use(express.json()); // Parse JSON
app.use(cors({
    origin: process.env.FRONTEND_URL, // Moved to .env
    credentials: true, // Allow session cookies
}));

// Connect to Database
connectDB(); // Assumes connectDB uses process.env.MONGO_URI

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api', preScheduleRoutes);

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));