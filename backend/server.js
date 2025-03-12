//server.js






require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path"); // Added for serving static files
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const visitorRoutes = require("./src/routes/visitorRoutes");
const preScheduleRoutes = require("./src/routes/preScheduleRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./src/routes/userRoutes");
const reportRoutes = require("./src/routes/reportRoutes");

// Initialize Express App
const app = express();

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 5 * 60 * 1000, // 5 minutes
    },
  })
);

// Middleware
app.use(express.json()); // Parse JSON
app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true, // Allow session cookies
  })
);

// Serve static files (for uploaded photos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Connect to Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api", preScheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);

// Health Check Endpoint (optional but useful)
app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is running" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));