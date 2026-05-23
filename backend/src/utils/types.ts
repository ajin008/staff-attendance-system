export interface registerPayload {
  companyName: string;
  industry: string;
  adminName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthUser {
  id: number;

  organizationId: number;

  staffId: string | null;

  name: string;

  email: string;

  phone: string | null;

  role: "admin" | "staff";

  joinedOn: Date;
}

export interface LoginResult {
  user: AuthUser;
  token: string;
}

export interface CreateStaffInput {
  organizationId: number;

  departmentId: number;

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
