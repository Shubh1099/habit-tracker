const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  name: {
    type: String,
    required: [true, "Habit name is required."],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  completions: [
    {
      date: {
        type: Date,
        required: true,
      },
    },
  ],
  color: {
    type: String,
    default: "#27a844",
  },
});

HabitSchema.index({ _id: 1, "completions.date": 1 }, { unique: true });
module.exports = mongoose.model("Habit", HabitSchema);
