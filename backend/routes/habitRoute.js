const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { protect } = require("../middlewares/authMiddleware"); 


router.use(protect);


// GET /api/habits - Fetch user's habits  
router.get("/", async (req, res) => {
  try {
    // Find only habits belonging to the logged-in user (req.user is added by protect middleware)
    const habits = await Habit.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(habits);
  } catch (error) {
    /* ... error handling ... */
  }
});

// POST /api/habits - Create a new habit for the user
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name)
    return res.status(400).json({ message: "Habit name is required." });

  try {
    // Add userId from the authenticated user
    const newHabit = new Habit({ name, userId: req.user._id });
    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    /* ... error handling ... */
  }
});

// DELETE /api/habits/:id - Delete a user's habit by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const habit = await Habit.findById(id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found." });
    }

    // --- Check if habit belongs to the user ---
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "User not authorized to delete this habit" });
    }

    await habit.deleteOne(); // Use deleteOne() or findByIdAndDelete(id)
    res.status(200).json({ message: "Habit deleted successfully.", id: id });
  } catch (error) {
    /* ... error handling ... */
  }
});

// PATCH /api/habits/:id/toggle/:dateString - Toggle completion for a user's habit
router.patch("/:id/toggle/:dateString", async (req, res) => {
  const { id, dateString } = req.params;
  const targetDate = new Date(dateString + "T00:00:00.000Z");
  // ... (keep date validation) ...

  try {
    const habit = await Habit.findById(id);
    if (!habit) return res.status(404).json({ message: "Habit not found." });

    // --- Check if habit belongs to the user ---
    if (habit.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "User not authorized to modify this habit" });
    }

    // ... (keep existing logic for finding completionIndex, push/pull) ...
    const completionIndex = habit.completions.findIndex(
      (comp) => comp.date.getTime() === targetDate.getTime()
    );
    if (completionIndex > -1) {
      habit.completions.pull({ _id: habit.completions[completionIndex]._id });
    } else {
      habit.completions.push({ date: targetDate });
    }

    const updatedHabit = await habit.save();
    res.status(200).json(updatedHabit);
  } catch (error) {
    /* ... error handling, keep logs if needed */
  }
});

module.exports = router;
