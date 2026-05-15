export interface User {
  _id: string;
  staffId: string;
  name: string;
  email: string;
  role: "admin" | "staff";
  joinedOn: string;
  phone?: string;
}

export interface PopulatedUser {
  _id: string;
  name: string;
  staffId: string;
  email: string;
}

export interface AttendanceRecord {
  _id: string;
  userId: string | PopulatedUser;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workMinutes: number;
  status: "present" | "incomplete" | "absent";
  name?: string;
  staffId?: string;
  email?: string;
  mood: Mood | null;
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface CreateStaffPayload {
  name: string;
  email: string;
  password: string;
  joinedOn: string;
  phone: string;
}

export interface TodaySummary {
  total: number;
  present: number;
  incomplete: number;
  absent: number;
}

export interface ApiError {
  message: string;
}

export type Mood = "tired" | "okay" | "good" | "happy" | "excited";
