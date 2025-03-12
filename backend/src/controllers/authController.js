





const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// 🔹 Register New User
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate required fields
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    // Validate role
    const validRoles = ['admin', 'receptionist', 'security', 'host'];
    const normalizedRole = role.toLowerCase();
    if (!validRoles.includes(normalizedRole)) {
      return res.status(400).json({ message: 'Invalid role. Allowed roles: admin, receptionist, security, host' });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const newUser = new User({ username, password, role: normalizedRole });
    await newUser.save();

    const token = generateToken(newUser._id, newUser.role);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
   // console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 🔹 Login User
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validate required fields
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
   // console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Get Authenticated User
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('username role');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      id: user._id,
      username: user.username,
      role: user.role,
    });
  } catch (error) {
   // console.error('Error in getUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Forgot Password (Placeholder)
const forgotPassword = async (req, res) => {
  const { username } = req.body;

  try {
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Placeholder: Send OTP via email/SMS in production
    res.status(200).json({ message: 'OTP sent to your registered contact (placeholder)' });
  } catch (error) {
   // console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Verify OTP (Placeholder)
const verifyOtp = async (req, res) => {
  const { username, otp } = req.body;

  try {
    if (!username || !otp) {
      return res.status(400).json({ message: 'Username and OTP are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Placeholder: Verify OTP in production
    res.status(200).json({ message: 'OTP verified successfully (placeholder)' });
  } catch (error) {
   // console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Reset Password
const resetPassword = async (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;

  try {
    if (!username || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'Username, new password, and confirm password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Update password (hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    //console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getUser, forgotPassword, verifyOtp, resetPassword };