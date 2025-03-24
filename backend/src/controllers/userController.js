

// // const User = require("../models/User");
// // const jwt = require("jsonwebtoken");
// // const bcrypt = require("bcryptjs");

// // // 🔹 Register New User
// // exports.registerUser = async (req, res) => {
// //   const { username, password, role } = req.body;

// //   try {
// //     // Validate required fields
// //     if (!username || !password || !role) {
// //       return res.status(400).json({ message: "Username, password, and role are required" });
// //     }

// //     // Validate role
// //     const validRoles = ["admin", "receptionist", "security", "host", "Estimator"];
// //     const normalizedRole = role.toLowerCase();
// //     if (!validRoles.includes(normalizedRole)) {
// //       return res.status(400).json({ message: "Invalid role. Allowed roles: admin, receptionist, security, host, Estimator" });
// //     }

// //     // Check if user already exists
// //     const userExists = await User.findOne({ username });
// //     if (userExists) {
// //       return res.status(400).json({ message: "User already exists" });
// //     }

// //     // Create new user (password will be hashed by pre-save hook)
// //     const user = await User.create({ username, password, role: normalizedRole });

// //     // Generate JWT token
// //     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// //     res.status(201).json({
// //       message: "User registered successfully",
// //       user: { id: user._id, username: user.username, role: user.role },
// //       token,
// //     });
// //   } catch (error) {
// //     console.error("Error in registerUser:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // 🔹 Login User
// // exports.loginUser = async (req, res) => {
// //   const { username, password } = req.body;

// //   try {
// //     // Validate required fields
// //     if (!username || !password) {
// //       return res.status(400).json({ message: "Username and password are required" });
// //     }

// //     // Find user by username
// //     const user = await User.findOne({ username });
// //     if (!user) {
// //       return res.status(400).json({ message: "Invalid Credentials" });
// //     }

// //     // Compare password
// //     const isMatch = await bcrypt.compare(password, user.password);
// //     if (!isMatch) {
// //       return res.status(400).json({ message: "Invalid Credentials" });
// //     }

// //     // Generate JWT token
// //     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

// //     res.json({
// //       message: "Login successful",
// //       token,
// //       user: { id: user._id, username: user.username, role: user.role },
// //     });
// //   } catch (error) {
// //     console.error("Error in loginUser:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // 🔹 Get All Users (Updated to return all fields except password)
// // exports.getUsers = async (req, res) => {
// //   try {
// //     const users = await User.find().select('-password');
// //     res.json(users);
// //   } catch (error) {
// //     console.error("Error fetching users:", error);
// //     res.status(500).json({ message: "Error fetching users", error: error.message });
// //   }
// // };

// // // 🔹 Update User
// // exports.updateUser = async (req, res) => {
// //   const { password } = req.body;

// //   try {
// //     const user = await User.findById(req.params.id);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Update password if provided (will be hashed by pre-save hook)
// //     if (password) {
// //       user.password = password;
// //     }

// //     await user.save();

// //     res.status(200).json({
// //       message: "User updated successfully",
// //       user: { id: user._id, username: user.username, role: user.role },
// //     });
// //   } catch (error) {
// //     console.error("Error in updateUser:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // // 🔹 Delete User
// // exports.deleteUser = async (req, res) => {
// //   try {
// //     const user = await User.findByIdAndDelete(req.params.id);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     res.status(200).json({ message: "User deleted successfully" });
// //   } catch (error) {
// //     console.error("Error in deleteUser:", error);
// //     res.status(500).json({ message: "Server Error", error: error.message });
// //   }
// // };

// // module.exports = exports;






// const User = require("../models/User");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");

// // 🔹 Register New User
// exports.registerUser = async (req, res) => {
//   const { username, password, role, department, email, phoneNumber } = req.body;

//   try {
//     // Validate required fields
//     if (!username || !password || !role || !department || !email || !phoneNumber) {
//       return res.status(400).json({ message: "All fields (username, password, role, department, email, phoneNumber) are required" });
//     }

//     // Validate role
//     const validRoles = ["admin", "receptionist", "security", "host", "Estimator"];
//     const normalizedRole = role.toLowerCase();
//     if (!validRoles.includes(normalizedRole)) {
//       return res.status(400).json({ message: "Invalid role. Allowed roles: admin, receptionist, security, host, Estimator" });
//     }

//     // Check if user already exists
//     const userExists = await User.findOne({ username });
//     if (userExists) {
//       return res.status(400).json({ message: "Username already exists" });
//     }

//     // Check if email already exists
//     const emailExists = await User.findOne({ email });
//     if (emailExists) {
//       return res.status(400).json({ message: "Email already exists" });
//     }

//     // Create new user (password will be hashed by pre-save hook)
//     const user = await User.create({ 
//       username, 
//       password, 
//       role: normalizedRole, 
//       department, 
//       email, 
//       phoneNumber 
//     });

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.status(201).json({
//       message: "User registered successfully",
//       user: { 
//         id: user._id, 
//         username: user.username, 
//         role: user.role, 
//         department: user.department, 
//         email: user.email, 
//         phoneNumber: user.phoneNumber 
//       },
//       token,
//     });
//   } catch (error) {
//     console.error("Error in registerUser:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // 🔹 Login User (Unchanged - uses only username and password)
// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     // Validate required fields
//     if (!username || !password) {
//       return res.status(400).json({ message: "Username and password are required" });
//     }

//     // Find user by username
//     const user = await User.findOne({ username });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid Credentials" });
//     }

//     // Generate JWT token
//     const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user._id, username: user.username, role: user.role },
//     });
//   } catch (error) {
//     console.error("Error in loginUser:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // 🔹 Get All Users (Updated to return all fields except password)
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users); // Returns username, role, department, email, phoneNumber
//   } catch (error) {
//     console.error("Error fetching users:", error);
//     res.status(500).json({ message: "Error fetching users", error: error.message });
//   }
// };

// // 🔹 Update User
// exports.updateUser = async (req, res) => {
//   const { password } = req.body;

//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update password if provided (will be hashed by pre-save hook)
//     if (password) {
//       user.password = password;
//     }

//     await user.save();

//     res.status(200).json({
//       message: "User updated successfully",
//       user: { id: user._id, username: user.username, role: user.role },
//     });
//   } catch (error) {
//     console.error("Error in updateUser:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// // 🔹 Delete User
// exports.deleteUser = async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (error) {
//     console.error("Error in deleteUser:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };

// module.exports = exports;







// controllers/userController.js

const User = require("../models/User");

// 🔹 Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

// 🔹 Update User
const updateUser = async (req, res) => {
  const { username, password, role, department, email, phoneNumber } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields if provided
    if (username) user.username = username;
    if (password) user.password = password;
    if (role) user.role = role;
    if (department) user.department = department;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        department: user.department,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// 🔹 Delete User
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

module.exports = { getUsers, updateUser, deleteUser };