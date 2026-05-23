export interface User {
  id: number;
  organizationId: number;

  staffId?: string;

  name: string;
  email: string;
  phone?: string;

  role: "admin" | "staff";

  joinedOn: string;
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

export interface RegisterPayload {
  companyName: string;
  industry: string;
  role: string;
  email: string;
  phone: string;
  password: string;
}

export interface ApiError {
  message: string;
}

export type Mood = "tired" | "okay" | "good" | "happy" | "excited";

export interface RegisterCompanyPayload {
  companyName: string;
  industry: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
}

export interface CreateDepartmentPayload {
  name: string;

  shiftStart: string;

  shiftEnd: string;

  overtimeEnabled: boolean;

  overtimeGraceMins: number;

  overtimeHourlyRate?: number;

  defaultSalary: number;
}

export interface Department {
  id: number;

  organizationId: number;

  name: string;

  shiftStart: string;

  shiftEnd: string;

  overtimeEnabled: boolean;

  overtimeGraceMins: number;

  overtimeHourlyRate?: number | null;

  defaultSalary: number;

  createdAt: string;

  updatedAt: string;
}
