// client/src/components/HabitForm.tsx
import React, { useState, FormEvent } from "react";

// Define the type for the props expected by this component
interface HabitFormProps {
  // The function to call when a new habit should be added
  onAddHabit: (name: string) => Promise<void> | void; // Can be async or sync
}

const HabitForm: React.FC<HabitFormProps> = ({ onAddHabit }) => {
  // State to hold the value of the input field
  const [habitName, setHabitName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Prevent double clicks

  // Handler for form submission
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault(); // Prevent default page reload
    const trimmedName = habitName.trim();

    if (!trimmedName) {
      alert("Please enter a habit name."); // Simple validation
      return;
    }

    if (isSubmitting) return; // Avoid double submission

    setIsSubmitting(true);
    try {
      // Call the function passed from the App component
      await onAddHabit(trimmedName);
      setHabitName(""); // Clear the input field after successful submission
    } catch (error) {
      // Error handling is likely done in the parent (App.tsx),
      // but you could add specific form feedback here if needed.
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false); // Re-enable button
    }
  };

  return (
    // Apply Tailwind classes for margin-bottom and general form layout
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
        // Apply Tailwind classes for styling the input
        className="flex-grow px-4 py-2 border border-gray-300 dark: rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-300 text-gray-900  placeholder:text-gray-500 placeholder:font-extralight font-bold text-xl "
        required // HTML5 validation
        disabled={isSubmitting} // Disable input while submitting
      />
      <button
        type="submit"
        // Apply Tailwind classes for styling the button
        className={`px-4 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isSubmitting} // Disable button while submitting
      >
        {isSubmitting ? "Adding..." : "Add Habit"}
      </button>
    </form>
  );
};

export default HabitForm;
