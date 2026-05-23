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
