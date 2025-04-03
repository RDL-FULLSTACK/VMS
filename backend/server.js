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
const mongoose = require("mongoose");
const fs = require("fs");

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
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// Ensure loginimage directory exists
const loginImageDir = path.join(__dirname, "loginimage");
if (!fs.existsSync(loginImageDir)) {
  fs.mkdirSync(loginImageDir);
}

// Storage configuration for login images
const imageStorage = multer.diskStorage({
  destination: "./loginimage/", // Changed to loginimage folder
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const imageUpload = multer({ storage: imageStorage });

// Serve static files from loginimage folder
app.use("/loginimage", express.static(path.join(__dirname, "loginimage")));

// Connect to Database
connectDB();

// MongoDB Schema for Login Images
const loginImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const LoginImage = mongoose.model("LoginImage", loginImageSchema);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api", preScheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/self-checkins", selfCheckinRoutes);

// Upload login image endpoint
app.post("/api/upload", imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `/loginimage/${req.file.filename}`;
  console.log("Saving image URL to MongoDB:", imageUrl); // Debug log
  try {
    const newImage = new LoginImage({ url: imageUrl });
    await newImage.save();
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to save image URL", error: error.message });
  }
});

// Fetch all login images
app.get("/api/login-images", async (req, res) => {
  try {
    const images = await LoginImage.find().select("url -_id");
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000"; // Fallback
    const imageUrls = images.map((img) => `${backendUrl}${img.url}`);
    console.log("Returning image URLs:", imageUrls); // Debug log
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
});

// Delete a login image
app.delete("/api/login-images/:url", async (req, res) => {
  try {
    // The :url param might be URL-encoded and include the full BACKEND_URL
    const encodedUrl = req.params.url; // e.g., "http%3A%2F%2Flocalhost%3A5000%2Floginimage%2F1743657999231-hotwheels.jpg"
    const decodedUrl = decodeURIComponent(encodedUrl); // e.g., "http://localhost:5000/loginimage/1743657999231-hotwheels.jpg"
    console.log("Received URL to delete:", decodedUrl); // Debug log

    // Extract the relative path by removing the BACKEND_URL
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
    const relativeUrl = decodedUrl.replace(backendUrl, ""); // e.g., "/loginimage/1743657999231-hotwheels.jpg"
    console.log("Relative URL for MongoDB query:", relativeUrl); // Debug log

    // Delete from MongoDB
    const result = await LoginImage.deleteOne({ url: relativeUrl });
    console.log("MongoDB delete result:", result); // Debug log
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Image not found in database" });
    }

    // Delete the file from the filesystem
    const filePath = path.join(__dirname, "loginimage", path.basename(relativeUrl));
    console.log("File path to delete:", filePath); // Debug log
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log("File deleted from filesystem:", filePath);
    } else {
      console.log("File not found on filesystem:", filePath);
    }

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
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