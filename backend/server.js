// // server.js
// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./src/config/db");
// const authRoutes = require("./src/routes/authRoutes");
// const vehicleRoutes = require("./src/routes/vehicleRoutes");
// const visitorRoutes = require("./src/routes/visitorRoutes");
// const preScheduleRoutes = require("./src/routes/preScheduleRoutes");
// const session = require("express-session");
// const MongoStore = require("connect-mongo");
// const userRoutes = require("./src/routes/userRoutes");
// const reportRoutes = require("./src/routes/reportRoutes");
// const selfCheckinRoutes = require("./src/routes/selfCheckinRoutes"); // Add this line

// // Initialize Express App
// const app = express();

// // Session Configuration
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: MongoStore.create({
//       mongoUrl: process.env.MONGO_URI,
//     }),
//     cookie: {
//       secure: process.env.NODE_ENV === "production",
//       httpOnly: true,
//       maxAge: 5 * 60 * 1000, // 5 minutes
//     },
//   })
// );

// // Middleware
// app.use(express.json()); // Parse JSON
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true, // Allow session cookies
//   })
// );

// // Serve static files (for uploaded photos)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Connect to Database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/visitors", visitorRoutes);
// app.use("/api", preScheduleRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/self-checkins", selfCheckinRoutes); // Add this line

// // Health Check Endpoint (optional but useful)
// app.get("/health", (req, res) => {
//   res.status(200).json({ message: "Server is running" });
// });

// // Error Handling Middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: "Something went wrong!", error: err.message });
// });

// // Server Port
// const PORT = process.env.PORT || 5000;

// // Start Server
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js
// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const vehicleRoutes = require("./src/routes/vehicleRoutes");
const visitorRoutes = require("./src/routes/visitorRoutes");
const preScheduleRoutes = require("./src/routes/preScheduleRoutes");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const userRoutes = require("./src/routes/userRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const selfCheckinRoutes = require("./src/routes/selfCheckinRoutes");
const multer = require("multer");

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

// Serve static files (for uploaded photos and logos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/logoImages", express.static(path.join(__dirname, "logoImages")));

// Connect to Database
connectDB();

// Multer Storage Configuration for Login Images
const imageStorage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const imageUpload = multer({ storage: imageStorage });

// Multer Storage Configuration for Logo Images
const logoStorage = multer.diskStorage({
  destination: "./logoImages/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const logoUpload = multer({ storage: logoStorage });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api", preScheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/self-checkins", selfCheckinRoutes);

// Upload Login Image Endpoint
app.post("/api/upload", imageUpload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Upload Logo Image Endpoint
app.post("/api/upload-logo", logoUpload.single("logo"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ logoUrl: `/logoImages/${req.file.filename}` });
});

// Dummy Auth Endpoint for User Role (modify as per your auth logic)
app.get("/api/auth/user", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  // Mock response; replace with actual user data retrieval
  res.json({ role: "admin" }); // Example role
});

// Health Check Endpoint
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