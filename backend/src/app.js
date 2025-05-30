const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();
connectDB();

app.use(express.json()); // Parse JSON request bodies

app.use("/api/auth", authRoutes); // Mount authentication routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
