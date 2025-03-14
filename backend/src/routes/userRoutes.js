// //userRoutes.js

// const express = require('express');
// const { registerUser, loginUser, } = require('../controllers/userController');
// const { getUsers } = require("../controllers/userController");


// const router = express.Router();

// router.post('/register', registerUser);
// router.post('/login', loginUser);

// router.get("/", getUsers);

// module.exports = router;




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