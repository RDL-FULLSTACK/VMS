

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