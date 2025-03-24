


const express = require("express");
const {
  getUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Protected routes (require authentication)
// router.get("/", authMiddleware, getUsers); // Fetch all users
router.put("/:id", authMiddleware, updateUser); // Update a user by ID
router.delete("/:id", authMiddleware, deleteUser); // Delete a user by ID
router.get("/", getUsers);

module.exports = router;