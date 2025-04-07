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
// const selfCheckinRoutes = require("./src/routes/selfCheckinRoutes");
// const multer = require("multer");
// const mongoose = require("mongoose");
// const fs = require("fs");

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
// app.use(express.json());
// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//   })
// );

// // Ensure loginimage directory exists
// const loginImageDir = path.join(__dirname, "loginimage");
// if (!fs.existsSync(loginImageDir)) {
//   fs.mkdirSync(loginImageDir);
// }

// // Ensure logo directory exists
// const logoDir = path.join(__dirname, "logo");
// if (!fs.existsSync(logoDir)) {
//   fs.mkdirSync(logoDir);
// }

// // Storage configuration for login images
// const imageStorage = multer.diskStorage({
//   destination: "./loginimage/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const imageUpload = multer({ storage: imageStorage });

// // Storage configuration for logos
// const logoStorage = multer.diskStorage({
//   destination: "./logo/",
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const logoUpload = multer({ storage: logoStorage });

// // Serve static files from loginimage and logo folders
// app.use("/loginimage", express.static(path.join(__dirname, "loginimage")));
// app.use("/logo", express.static(path.join(__dirname, "logo")));

// // Connect to Database
// connectDB();

// // MongoDB Schema for Login Images
// const loginImageSchema = new mongoose.Schema({
//   url: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
// const LoginImage = mongoose.model("LoginImage", loginImageSchema);

// // MongoDB Schema for Logos
// const logoSchema = new mongoose.Schema({
//   url: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });
// const Logo = mongoose.model("Logo", logoSchema);

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/vehicles", vehicleRoutes);
// app.use("/api/visitors", visitorRoutes);
// app.use("/api", preScheduleRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/reports", reportRoutes);
// app.use("/api/self-checkins", selfCheckinRoutes);

// // Upload login image endpoint
// app.post("/api/upload", imageUpload.single("image"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const imageUrl = `/loginimage/${req.file.filename}`;
//   console.log("Saving image URL to MongoDB:", imageUrl);
//   try {
//     const newImage = new LoginImage({ url: imageUrl });
//     await newImage.save();
//     res.json({ imageUrl });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to save image URL", error: error.message });
//   }
// });

// // Upload logo endpoint
// app.post("/api/upload-logo", logoUpload.single("logo"), async (req, res) => {
//   if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//   const logoUrl = `/logo/${req.file.filename}`;
//   console.log("Saving logo URL to MongoDB:", logoUrl);
//   try {
//     const newLogo = new Logo({ url: logoUrl });
//     await newLogo.save();
//     res.json({ logoUrl });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to save logo URL", error: error.message });
//   }
// });

// // Fetch all login images
// app.get("/api/login-images", async (req, res) => {
//   try {
//     const images = await LoginImage.find().select("url -_id");
//     const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
//     const imageUrls = images.map((img) => `${backendUrl}${img.url}`);
//     console.log("Returning image URLs:", imageUrls);
//     res.json(imageUrls);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch images", error: error.message });
//   }
// });

// // Fetch all logos
// app.get("/api/logos", async (req, res) => {
//   try {
//     const logos = await Logo.find().select("url -_id");
//     const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
//     const logoUrls = logos.map((logo) => `${backendUrl}${logo.url}`);
//     console.log("Returning logo URLs:", logoUrls);
//     res.json(logoUrls);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to fetch logos", error: error.message });
//   }
// });

// // Delete a login image
// app.delete("/api/login-images/:url", async (req, res) => {
//   try {
//     const encodedUrl = req.params.url;
//     const decodedUrl = decodeURIComponent(encodedUrl);
//     console.log("Received URL to delete:", decodedUrl);

//     const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
//     const relativeUrl = decodedUrl.replace(backendUrl, "");
//     console.log("Relative URL for MongoDB query:", relativeUrl);

//     const result = await LoginImage.deleteOne({ url: relativeUrl });
//     console.log("MongoDB delete result:", result);
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Image not found in database" });
//     }

//     const filePath = path.join(__dirname, "loginimage", path.basename(relativeUrl));
//     console.log("File path to delete:", filePath);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log("File deleted from filesystem:", filePath);
//     } else {
//       console.log("File not found on filesystem:", filePath);
//     }

//     res.json({ message: "Image deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting image:", error);
//     res.status(500).json({ message: "Failed to delete image", error: error.message });
//   }
// });

// // Delete a logo
// app.delete("/api/logos/:url", async (req, res) => {
//   try {
//     const encodedUrl = req.params.url;
//     const decodedUrl = decodeURIComponent(encodedUrl);
//     console.log("Received URL to delete:", decodedUrl);

//     const backendUrl = process.env.BACKEND_URL || "http://localhost:5000";
//     const relativeUrl = decodedUrl.replace(backendUrl, "");
//     console.log("Relative URL for MongoDB query:", relativeUrl);

//     const result = await Logo.deleteOne({ url: relativeUrl });
//     console.log("MongoDB delete result:", result);
//     if (result.deletedCount === 0) {
//       return res.status(404).json({ message: "Logo not found in database" });
//     }

//     const filePath = path.join(__dirname, "logo", path.basename(relativeUrl));
//     console.log("File path to delete:", filePath);
//     if (fs.existsSync(filePath)) {
//       fs.unlinkSync(filePath);
//       console.log("File deleted from filesystem:", filePath);
//     } else {
//       console.log("File not found on filesystem:", filePath);
//     }

//     res.json({ message: "Logo deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting logo:", error);
//     res.status(500).json({ message: "Failed to delete logo", error: error.message });
//   }
// });

// // Health Check Endpoint
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
//qu
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
      maxAge: 5 * 60 * 1000,
      sameSite: "lax",
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

// Ensure directories exist
const loginImageDir = path.join(__dirname, "loginimage");
if (!fs.existsSync(loginImageDir)) fs.mkdirSync(loginImageDir);

const logoDir = path.join(__dirname, "logo");
if (!fs.existsSync(logoDir)) fs.mkdirSync(logoDir);

// Storage configuration for login images and logos
const imageStorage = multer.diskStorage({
  destination: "./loginimage/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const imageUpload = multer({ storage: imageStorage });

const logoStorage = multer.diskStorage({
  destination: "./logo/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const logoUpload = multer({ storage: logoStorage });

// Serve static files
app.use("/loginimage", express.static(loginImageDir));
app.use("/logo", express.static(logoDir));

// Connect to Database
connectDB();

// MongoDB Schemas
const loginImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const LoginImage = mongoose.model("LoginImage", loginImageSchema);

const logoSchema = new mongoose.Schema({
  url: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});
const Logo = mongoose.model("Logo", logoSchema);

const quizSchema = new mongoose.Schema({
  videoUrl: { type: String, required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true }
  }],
  createdAt: { type: Date, default: Date.now },
});
const Quiz = mongoose.model("Quiz", quizSchema, "qu"); // Collection name explicitly set to 'qu'

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api", preScheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/self-checkins", selfCheckinRoutes);

// Quiz Routes
app.post("/api/quizzes", async (req, res) => {
  console.log("Received quiz data:", req.body);
  try {
    const quiz = new Quiz(req.body);
    await quiz.save();
    console.log("Quiz saved successfully to 'qu' collection:", quiz);
    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error saving quiz:", error);
    res.status(400).json({ message: "Failed to save quiz", error: error.message });
  }
});

app.get("/api/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ message: "Failed to fetch quizzes", error: error.message });
  }
});

// Image Upload Routes
app.post("/api/upload", imageUpload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const imageUrl = `/loginimage/${req.file.filename}`;
  try {
    const newImage = new LoginImage({ url: imageUrl });
    await newImage.save();
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to save image URL", error: error.message });
  }
});

app.post("/api/upload-logo", logoUpload.single("logo"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  const logoUrl = `/logo/${req.file.filename}`;
  try {
    const newLogo = new Logo({ url: logoUrl });
    await newLogo.save();
    res.json({ logoUrl });
  } catch (error) {
    res.status(500).json({ message: "Failed to save logo URL", error: error.message });
  }
});

// Fetch Images and Logos
app.get("/api/login-images", async (req, res) => {
  try {
    const images = await LoginImage.find().select("url -_id");
    const backendUrl = process.env.BACKEND_URL;
    const imageUrls = images.map((img) => `${backendUrl}${img.url}`);
    res.json(imageUrls);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch images", error: error.message });
  }
});

app.get("/api/logos", async (req, res) => {
  try {
    const logos = await Logo.find().select("url -_id");
    const backendUrl = process.env.BACKEND_URL;
    const logoUrls = logos.map((logo) => `${backendUrl}${logo.url}`);
    res.json(logoUrls);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch logos", error: error.message });
  }
});

// Delete Routes
app.delete("/api/login-images/:url", async (req, res) => {
  try {
    const decodedUrl = decodeURIComponent(req.params.url);
    const backendUrl = process.env.BACKEND_URL;
    const relativeUrl = decodedUrl.replace(backendUrl, "");

    const result = await LoginImage.deleteOne({ url: relativeUrl });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Image not found in database" });
    }

    const filePath = path.join(__dirname, "loginimage", path.basename(relativeUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete image", error: error.message });
  }
});

app.delete("/api/logos/:url", async (req, res) => {
  try {
    const decodedUrl = decodeURIComponent(req.params.url);
    const backendUrl = process.env.BACKEND_URL;
    const relativeUrl = decodedUrl.replace(backendUrl, "");

    const result = await Logo.deleteOne({ url: relativeUrl });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Logo not found in database" });
    }

    const filePath = path.join(__dirname, "logo", path.basename(relativeUrl));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: "Logo deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete logo", error: error.message });
  }
});

// Health Check
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