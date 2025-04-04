
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  name: {
    type: String,
    required: [true, "Habit name is required."], 
    trim: true, // Removes whitespace from start/end
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
  // Array to store the dates when the habit was marked as completed
  completions: [
    {
      date: {
        type: Date,
        required: true,
        // Important: Store only the date part (set time to midnight UTC)
        // We will handle this in the route logic before saving/updating
      },
      // You could add more fields here later if needed, e.g., notes: String
    },
  ],
  // Optional: color for the heatmap, matching the screenshot's green
  color: {
    type: String,
    default: "#27a844", // A common green color, adjust if needed
  },

});

// Optional Index: Can potentially improve query performance for finding completions
// Ensures that for a specific habit (_id), a completion date is unique.
// Note: The $addToSet operator in the update logic also helps prevent duplicates.
HabitSchema.index({ _id: 1, "completions.date": 1 }, { unique: true });

// Compile the schema into a model and export it
module.exports = mongoose.model("Habit", HabitSchema);
