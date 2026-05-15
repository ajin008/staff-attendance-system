import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateStaffId } from "../utils/staffId";
import { IUser } from "../models/User";
import {
  createUser,
  deleteUserByStaffId,
  findAdminExists,
  findAllStaff,
  findUserByEmail,
  findUserByStaffId,
  updateStaffById,
} from "../Repository/auth.repository";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";

interface LoginResult {
  user: Omit<IUser, "password">;
  token: string;
}

interface CreateStaffInput {
  name: string;
  email: string;
  password: string;
  joinedOn: string;
  phone: string;
}

export const loginService = async (
  identifier: string,
  password: string
): Promise<LoginResult> => {
  const isEmail = identifier.includes("@");
  const user = isEmail
    ? await findUserByEmail(identifier)
    : await findUserByStaffId(identifier);

  if (!user) throw new AppError("invalid credentials", 401);
  const isMatch = await bcrypt.compare(password, user.password);
  // console.log("Password match:", isMatch);

  if (!isMatch) throw new AppError("invalid credentials", 401);

  const token = generateToken(user._id.toString(), user.role);

  return {
    token,
    user: {
      _id: user._id,
      staffId: user.staffId,
      name: user.name,
      email: user.email,
      role: user.role,
      joinedOn: user.joinedOn,
    } as Omit<IUser, "password">,
  };
};

export const createStaffService = async (
  input: CreateStaffInput
): Promise<{ message: string; staffId: string }> => {
  const exists = await findUserByEmail(input.email);
  if (exists) throw new AppError("Email already exists", 400);

  const staffId = await generateStaffId();

  await createUser({
    staffId,
    name: input.name,
    email: input.email,
    password: input.password,
    role: "staff",
    joinedOn: input.joinedOn,
    phone: input.phone,
  });
  return { message: "Staff created successfully", staffId };
};

export const getAllStaffService = async (
  page: number = 1,
  limit: number = 20,
  search: string = ""
) => {
  const { staff, total } = await findAllStaff(page, limit, search);

  return {
    staff,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page < Math.ceil(total / limit),
    hasPrevPage: page > 1,
  };
};
export const deleteStaffService = async (staffId: string): Promise<void> => {
  const user = await findUserByStaffId(staffId);
  if (!user) throw new AppError("Staff not found", 404);
  await deleteUserByStaffId(staffId);
};

export const seedAdminService = async (): Promise<{ message: string }> => {
  const exists = await findAdminExists();
  if (exists) throw new AppError("Admin already exists", 400);

  await createUser({
    staffId: "ADMIN001",
    name: "Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "admin",
    joinedOn: new Date().toISOString().split("T")[0],
  });

  return {
    message: "Admin created — email: admin@company.com password: admin123",
  };
};

export const updateStaffService = async (
  staffId: string,
  input: Partial<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>
) => {
  if (input.password) {
    const bcrypt = await import("bcryptjs");
    input.password = await bcrypt.hash(input.password, 12);
  }
  const user = await updateStaffById(staffId, input);
  if (!user) throw new AppError("Staff not found", 404);
  return user;
};
