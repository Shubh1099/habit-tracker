import React from "react";
import { Habit } from "../types";

import HabitItem from "./HabitItem";

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

  if (habits.length === 0) {
    return (
      <p className="text-center text-gray-500 my-6">
        No habits added yet. Add one above to get started!
      </p>
    );
  }

  return (

    <div className="space-y-4">
      {habits.map((habit) => (

        <HabitItem
          key={habit._id}
          habit={habit}
          onDelete={onDeleteHabit}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default HabitList;
