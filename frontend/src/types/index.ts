export interface User {
  createdAt: string;
  id: number;
  organizationId: number;
  departmentId?: number;

  department?: StaffDepartment;

  staffId?: string;

  name: string;
  email: string;
  phone?: string;
  branch?: string;

  role: "admin" | "staff";

  joinedOn: string;
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

export interface Branch {
  name: string;
  latitude: number;
  longitude: number;
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
  branches: Branch[];
}

export interface RegisterResponse {
  message: string;
  user: User;
  company?: {
    id: number;
    name: string;
    branches: Branch[];
  };
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
  overtimeHourlyRate?: number;
  defaultSalary: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllDepartmentsResponse {
  departments: Department[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface StaffDepartment {
  id: number;
  name: string;
}

export interface CreateStaffInput {
  organizationId: number;
  departmentId: number;
  branchId?: number;
  name: string;
  email: string;
  phone?: string;
  branch?: string;
  password: string;
  joinedOn: Date;
  // OPTIONAL OVERRIDES
  shiftStart?: string;
  shiftEnd?: string;
  salary?: number;
  overtimeEnabled?: boolean;
  overtimeHourlyRate?: number;
  overtimeGraceMins?: number;
}

export interface Staff {
  id: number;
  staffId: string;
  name: string;
  email: string;
  phone?: string;
  branch?: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  } | null;
  branchId?: number;
  department?: {
    id: number;
    name: string;
    shiftStart?: string;
    shiftEnd?: string;
  };
  departmentId?: number;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  joinedOn?: string;
  shiftStart?: string | null;
  shiftEnd?: string | null;
  salary?: number | null;
  overtimeEnabled?: boolean | null;
  overtimeGraceMins?: number | null;
  overtimeHourlyRate?: number | null;
}

export interface GetAllStaffResponse {
  staffs: Staff[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
