import React, { useState, FormEvent } from "react";
interface HabitFormProps {
  onAddHabit: (name: string) => Promise<void> | void;
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
  const [habitName, setHabitName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      alert("Please enter a habit name.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddHabit(trimmedName);
      setHabitName("");
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 flex flex-col sm:flex-row gap-2"
    >
      <input
        type="text"
        value={habitName}
        onChange={(e) => setHabitName(e.target.value)}
        placeholder="Enter new habit (e.g., Exercise)"
        aria-label="New habit name"
        className="flex-grow px-4 py-2 border border-gray-300 dark: rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-300 text-gray-900  placeholder:text-gray-500 placeholder:font-extralight font-bold text-xl "
        required
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
};

export default HabitForm;
