// client/src/services/api.ts
import axios from "axios";
import { Habit } from "../types"; // Import the Habit type

// Define the base URL of your backend server
// Make sure your backend server is running!
const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api"; // Use environment variable or default

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- API Functions ---

// Fetch all habits
export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await apiClient.get<Habit[]>("/habits");
    return response.data;
  } catch (error) {
    console.error("Error fetching habits:", error);
    throw error; // Re-throw error to be handled by the calling component
  }
};

// Create a new habit
export const createHabit = async (name: string): Promise<Habit> => {
  try {
    const response = await apiClient.post<Habit>("/habits", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};

// Delete a habit by ID
export const deleteHabit = async (
  id: string
): Promise<{ message: string; id: string }> => {
  try {
    const response = await apiClient.delete<{ message: string; id: string }>(
      `/habits/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting habit:", error);
    throw error;
  }
};

// Toggle completion status for a specific date (send date as YYYY-MM-DD)
export const toggleHabitCompletion = async (
  id: string,
  dateString: string
): Promise<Habit> => {
  // Ensure dateString is in YYYY-MM-DD format before sending
  // Example validation (can be more robust)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    throw new Error("Invalid date format for API. Use YYYY-MM-DD.");
  }

  try {
    const response = await apiClient.patch<Habit>(
      `/habits/${id}/toggle/${dateString}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    throw error;
  }
};
