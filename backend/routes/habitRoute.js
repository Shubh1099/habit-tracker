const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit"); // Import the Habit model

router.get("/", async (req, res) => {
  try {
    const habits = await Habit.find().sort({ createdAt: -1 });
    // --- Add/Confirm this log ---
    res.status(200).json(habits);
  } catch (error) {
    console.error("[API GET /] Error fetching habits:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch habits", error: error.message });
  }
});

// POST /api/habits - Create a new habit
router.post("/", async (req, res) => {
  const { name } = req.body; // Extract name from request body

  if (!name) {
    return res.status(400).json({ message: "Habit name is required." });
  }

  try {
    const newHabit = new Habit({ name });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit); // 201 Created status
  } catch (error) {
    console.error("Error creating habit:", error);
    // Handle potential duplicate key error if name needs to be unique later
    res
      .status(500)
      .json({ message: "Failed to create habit", error: error.message });
  }
});

// DELETE /api/habits/:id - Delete a habit by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params; // Get habit ID from URL parameter

  try {
    const deletedHabit = await Habit.findByIdAndDelete(id);
    if (!deletedHabit) {
      return res.status(404).json({ message: "Habit not found." });
    }
    res
      .status(200)
      .json({ message: "Habit deleted successfully.", id: deletedHabit._id });
  } catch (error) {
    console.error("Error deleting habit:", error);
    res
      .status(500)
      .json({ message: "Failed to delete habit", error: error.message });
  }
});
// server/routes/habits.js (or your controller file)
router.patch("/:id/toggle/:dateString", async (req, res) => {
  const { id, dateString } = req.params;

  const targetDate = new Date(dateString + "T00:00:00.000Z");

  if (isNaN(targetDate.getTime())) {
    // Log error
    return res
      .status(400)
      .json({ message: "Invalid date format. Use YYYY-MM-DD." });
  }

  try {
    const habit = await Habit.findById(id);
    if (!habit) {
      // Log not found
      return res.status(404).json({ message: "Habit not found." });
    }
    // Log found habit

    // Log completions BEFORE modification attempt

    const completionIndex = habit.completions.findIndex(
      (comp) => comp.date.getTime() === targetDate.getTime()
    );
    // Log index result

    if (completionIndex > -1) {
      habit.completions.pull({ _id: habit.completions[completionIndex]._id });
    } else {
      habit.completions.push({ date: targetDate });
    }

    // Log completions AFTER modification attempt, BEFORE save

    // Save the changes
    const updatedHabit = await habit.save(); // Await the save!

    // Log the final saved document

    res.status(200).json(updatedHabit); // Return updated document
  } catch (error) {
    // Log the full error object

    res.status(500).json({
      message: "Failed to toggle habit completion",
      error: error.message, // Send back error message
      // Optionally send stack in development: error: process.env.NODE_ENV === 'development' ? error.stack : error.message
    });
  }
});

// Export the router
module.exports = router;
