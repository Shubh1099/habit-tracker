import axios from "axios";
import { Habit, AuthResponse } from "../types";

const API_BASE_URL =
  import.meta.env.VITE_APP_API_URL || "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Error in API request interceptor:", error);
    return Promise.reject(error);
  }
);

interface RegisterInput {
  username: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export const registerUser = async (
  userData: RegisterInput
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/register",
      userData
    );
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Registration failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred during registration.");
    }
  }
};

export const loginUser = async (
  credentials: LoginInput
): Promise<AuthResponse> => {
  try {
    const response = await apiClient.post<AuthResponse>(
      "/auth/login",
      credentials
    );
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Login failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred during login.");
    }
  }
};

// --- Habit API Functions ---

export const getHabits = async (): Promise<Habit[]> => {
  try {
    const response = await apiClient.get<Habit[]>("/habits");
    return response.data;
  } catch (error) {
    console.error("Error fetching habits:", error);
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Fetching habits failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while fetching habits.");
    }
  }
};

export const createHabit = async (name: string): Promise<Habit> => {
  try {
    const response = await apiClient.post<Habit>("/habits", { name });
    return response.data;
  } catch (error) {
    console.error("Error creating habit:", error);
    // --- Type Narrowing ---
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Creating habit failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while creating habit.");
    }
    // --- End Type Narrowing ---
  }
};

// Example for deleteHabit:
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
    // --- Type Narrowing ---
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Deleting habit failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while deleting habit.");
    }
    // --- End Type Narrowing ---
  }
};

// Example for toggleHabitCompletion:
export const toggleHabitCompletion = async (
  id: string,
  dateString: string
): Promise<Habit> => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Keep specific validation error
    throw new Error("Invalid date format for API. Use<x_bin_440>-MM-DD.");
  }
  try {
    const response = await apiClient.patch<Habit>(
      `/habits/${id}/toggle/${dateString}`
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling habit completion:", error);
    // --- Type Narrowing ---
    if (axios.isAxiosError(error)) {
      throw (
        error.response?.data ||
        new Error("Toggling completion failed due to network or server error.")
      );
    } else if (error instanceof Error) {
      throw error;
    } else {
      throw new Error("An unknown error occurred while toggling completion.");
    }
    // --- End Type Narrowing ---
  }
};
