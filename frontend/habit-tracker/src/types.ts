export interface Completion {
  _id?: string;
  date: string;
}

export interface Habit {
  _id: string;
  name: string;
  createdAt: string;
  completions: Completion[];
  color?: string;
}

export interface HeatmapValue {
  date: string;
  count: number;
}

export interface AuthResponse {
  _id: string;
  username: string;
  email: string;
  token: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
}
