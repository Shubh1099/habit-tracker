// server/server.js
require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const habitRoutes = require("./routes/habitRoute");
const authRoutes = require("./routes/authRoute");

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Enable parsing of JSON request bodies
app.use("/api/habits", habitRoutes);
app.use("/api/auth", authRoutes);

// Basic Route (for testing)
app.get("/", (req, res) => {
  res.send("Hello from Habit Tracker Backend!");
});

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI; // Get DB URI from .env
const PORT = process.env.PORT || 5001; // Use port from .env or default

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    // Start the server only after successful DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
    process.exit(1); // Exit process with failure
  });





