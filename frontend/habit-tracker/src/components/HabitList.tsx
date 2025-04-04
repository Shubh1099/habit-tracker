// client/src/components/HabitList.tsx
import React from "react";
import { Habit } from "../types"; // Import the Habit type

// Import the component for rendering individual habits (we'll create this next)
import HabitItem from "./HabitItem";

// Define the props expected by HabitList
interface HabitListProps {
  habits: Habit[];
  onDeleteHabit: (id: string) => void | Promise<void>;
  onToggleComplete: (id: string, dateString: string) => void | Promise<void>;
}

const HabitList: React.FC<HabitListProps> = ({
  habits,
  onDeleteHabit,
  onToggleComplete,
}) => {
  // Check if there are any habits to display
  if (habits.length === 0) {
    return (
      <p className="text-center text-gray-500 my-6">
        No habits added yet. Add one above to get started!
      </p>
    );
  }

  return (
    // Use a div or ul as the container for the list
    // Adding some vertical spacing between items using 'space-y-4'
    <div className="space-y-4">
      {habits.map((habit) => (
        // Render a HabitItem for each habit in the array
        <HabitItem
          key={habit._id} // Essential: Unique key for React list rendering
          habit={habit}
          onDelete={onDeleteHabit} // Pass the delete handler down
          onToggleComplete={onToggleComplete} // Pass the toggle handler down
        />
      ))}
    </div>
  );
};

export default HabitList;
