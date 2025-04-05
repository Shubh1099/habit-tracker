import React from "react";
import { Habit } from "../types";
import { calculateStreak } from "../lib/utils/calculateStreak";


import HabitHeatmap from "./HabitHeatmap";

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

  
  const currentStreak = calculateStreak(habit.completions);
  
  const handleDeleteClick = () => {

    if (
      window.confirm(
        `Are you sure you want to delete the habit "${habit.name}"?`
      )
    ) {
      onDelete(habit._id);
    }
  };
  return (

    <div className="bg-gray-800 p-4 rounded-lg shadow border border-gray-200 dark:border-gray-700">

      <div className="flex justify-between items-center mb-4">
        {" "}

        <div className="flex items-center gap-4">
          {" "}
          {/* Increased gap slightly */}

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            {habit.name}
          </h2>

          <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold px-3 py-1.5 rounded">
            {" "}

            {currentStreak} DAY STREAK
          </span>
        </div>

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

            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

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
