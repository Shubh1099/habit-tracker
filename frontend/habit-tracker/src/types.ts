// client/src/types.ts

export interface Completion {
  _id?: string; // Optional: MongoDB subdocument ID
  date: string; // Store as ISO String (YYYY-MM-DDTHH:mm:ss.sssZ) or just YYYY-MM-DD
}

export interface Habit {
  _id: string; // MongoDB document ID
  name: string;
  createdAt: string; // Store as ISO String
  completions: Completion[];
  color?: string; // Optional color
  // Add userId later if implementing auth: userId: string;
}

// Type for the data needed by react-calendar-heatmap
export interface HeatmapValue {
  date: string; // Expects 'YYYY-MM-DD' typically
  count: number; // We'll use 1 for completed, 0 for not
}

export interface AuthResponse {
  // Assuming backend returns user object fields directly + token
  _id: string;
  username: string;
  email: string;
  token: string;
  // Add any other fields your backend sends on login/register success
}

export interface User {
  _id: string;
  username: string;
  email: string;
}
