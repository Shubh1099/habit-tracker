// server/controllers/authController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Needed here only if re-selecting password manually often

// --- Helper to generate JWT ---
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // Token expires in 30 days
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check required fields
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide username, email, and password" });
    }

    // Check if user already exists (by email or username)
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res
        .status(400)
        .json({ message: "User already exists with that email or username" });
    }

    // Create user (password hashing happens via pre-save hook)
    const user = await User.create({
      username,
      email,
      password,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      // Send back user info (excluding password) and token
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Registration Error:", error);
    res
      .status(500)
      .json({
        message: "Server error during registration",
        error: error.message,
      });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check required fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Find user by email - explicitly select password for comparison
    const user = await User.findOne({ email }).select("+password");

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      // Generate token
      const token = generateToken(user._id);

      // Send back user info (excluding password) and token
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
