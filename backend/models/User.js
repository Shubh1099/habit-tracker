// server/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      // Basic email format validation
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6, // Enforce minimum password length
    select: false, // Don't send password back in queries by default
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// --- Password Hashing Middleware ---
// Run BEFORE saving a document
UserSchema.pre("save", async function (next) {
  // Only run if password was modified (or is new)
  if (!this.isModified("password")) {
    next();
  }
  // Hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Method to compare entered password with hashed password ---
UserSchema.methods.matchPassword = async function (enteredPassword) {
  // Need to re-select password since it's not selected by default
  const user = await this.constructor.findById(this._id).select("+password");
  return await bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model("User", UserSchema);
