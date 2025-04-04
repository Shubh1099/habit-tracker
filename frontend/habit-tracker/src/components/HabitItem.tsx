// client/src/components/HabitItem.tsx
import React from "react";
import { Habit } from "../types";
import { calculateStreak } from "../lib/utils/calculateStreak"; // Import the utility

// Import the heatmap component (we will create this next)
import HabitHeatmap from "./HabitHeatmap";

// Define the props expected by HabitItem
interface HabitItemProps {
  habit: Habit;
  onDelete: (id: string) => void | Promise<void>;
  onToggleComplete: (id: string, dateString: string) => void | Promise<void>;
}

const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  onDelete,
  onToggleComplete,
}) => {

   if (habit._id === "67ef5aeb24babae7d2e795dd") {
     // Optional: filter for a specific habit
   }
  // Calculate the current streak
  const currentStreak = calculateStreak(habit.completions);
   

  // Handler for the delete button click
  const handleDeleteClick = () => {
    // Optional: Confirmation dialog
    if (
      window.confirm(
        `Are you sure you want to delete the habit "${habit.name}"?`
      )
    ) {
      onDelete(habit._id); // Call the onDelete function passed from props
    }
  };
  return (
    // --- Adjustments Here ---
    // 1. Increase Padding: Changed p-4 to p-6
    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">
      {/* Top section: Name, Streak, Delete Button */}
      <div className="flex justify-between items-center mb-4">
        {" "}
        {/* Maybe increase mb-4 to mb-5 or mb-6 if needed */}
        <div className="flex items-center gap-4">
          {" "}
          {/* Increased gap slightly */}
          {/* 2. Increase Font Size: Changed text-xl to text-2xl */}
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {habit.name}
          </h2>
          {/* 3. Increase Badge Size: Added text-sm, changed px/py */}
          <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold px-3 py-1.5 rounded">
            {" "}
            {/* Adjusted padding & font */}
            {currentStreak} DAY STREAK
          </span>
        </div>
        {/* 4. Increase Icon Size: Changed h-5 w-5 to h-6 w-6 */}
        <button
          onClick={handleDeleteClick}
          title="Delete Habit"
          className="text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-150 p-1.5" // Increased padding slightly
          aria-label={`Delete habit ${habit.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            {" "}
            {/* Increased size */}
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Bottom section: Heatmap */}
      {/* The heatmap size adjusts somewhat based on available width */}
      <div>
        <HabitHeatmap
          habitId={habit._id}
          completions={habit.completions}
          color={habit.color || "#27a844"}
          onToggleComplete={onToggleComplete}
        />
      </div>
    </div>
  );
};

export default HabitItem;
