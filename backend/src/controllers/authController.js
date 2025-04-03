

// controllers/authController.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// 🔹 Register New User
const registerUser = async (req, res) => {
  const { username, password, role, department, email, phoneNumber } = req.body;

  try {
    if (!username || !password || !role || !department || !email || !phoneNumber) {
      return res.status(400).json({ message: 'Username, password, role, department, email, and phoneNumber are required' });
    }

    const validRoles = ['admin', 'receptionist', 'security', 'host'];
    const normalizedRole = role.toLowerCase();
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles: admin, receptionist, security, host' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = new User({ 
      username, 
      password, 
      role: normalizedRole, 
      department, 
      email, 
      phoneNumber 
    });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        department: newUser.department,
        email: newUser.email,
        phoneNumber: newUser.phoneNumber,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Get Authenticated User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username role department email phoneNumber');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
      department: user.department,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Get All Users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// 🔹 Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'OTP sent to your registered email (placeholder)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'OTP verified successfully (placeholder)' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Reset Password
const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Email, new password, and confirm password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUser, getUsers, forgotPassword, verifyOtp, resetPassword };