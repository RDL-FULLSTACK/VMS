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
const quizController = require("./src/controllers/quizController");
const cloudinary = require("cloudinary").v2;

// Initialize Express App
const app = express();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory:", uploadsDir);
}

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

// Storage configuration for quiz images (Cloudinary)
const quizImageStorage = multer.memoryStorage();
const quizImageUpload = multer({
  storage: quizImageStorage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/gif"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PNG, JPG, JPEG, GIF allowed."),
        false
      );
    }
  },
});

// Serve static files
app.use("/loginimage", express.static(loginImageDir));
app.use("/logo", express.static(logoDir));
app.use("/uploads", express.static(uploadsDir)); // Serve uploads directory

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api", preScheduleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/self-checkins", selfCheckinRoutes);

// Quiz Routes
app.post("/api/quizzes", quizController.createQuiz);
app.get("/api/quizzes", quizController.getQuizzes);
app.delete("/api/quizzes/:id", quizController.deleteQuiz);

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

// Quiz Image Upload Route (Cloudinary)
app.post(
  "/api/upload-quiz-image",
  quizImageUpload.single("image"),
  async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "quiz_images",
            resource_type: "image",
            public_id: `quiz_image_${Date.now()}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      res.json({ imageUrl: result.secure_url });
    } catch (error) {
      console.error("Error uploading quiz image:", error);
      res
        .status(500)
        .json({ message: "Failed to upload image", error: error.message });
    }
  }
);

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
  console.error("Global error:", err.stack);
  if (err instanceof multer.MulterError) {
    return res
      .status(400)
      .json({ success: false, message: `Multer error: ${err.message}` });
  }
  res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// Server Port
const PORT = process.env.PORT || 5000;

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));