import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateStaffId } from "../utils/staffId";

import {
  deleteUserByStaffId,
  findAdminExists,
  findAllStaff,
  updateStaffById,
} from "../Repository/auth.repository";
import AppError from "../utils/AppError";
import generateToken from "../utils/generateToken";
import { LoginResult, registerPayload } from "../utils/types";
import { findUserByEmail } from "../Repository/user.repository";
import prisma from "../utils/prisma";
import { createOrganization } from "../Repository/organization.repository";
import { createUser } from "../Repository/user.repository";
import { findUserByStaffId } from "../Repository/user.repository";
import { Prisma } from "@prisma/client";

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
  console.log("login service triggering");
  const isEmail = identifier.includes("@");
  const user = isEmail
    ? await findUserByEmail(identifier)
    : await findUserByStaffId(identifier);

  console.log("user find out in login service:", user);

  if (!user) throw new AppError("invalid credentials", 401);
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) throw new AppError("invalid credentials", 401);

  const token = generateToken(user.id, user.organizationId, user.role);

  return {
    token,

    user: {
      id: user.id,

      organizationId: user.organizationId,

      staffId: user.staffId,

      name: user.name,

      email: user.email,

      phone: user.phone,

      role: user.role,

      joinedOn: user.joinedOn,
    },
  };
};

// export const createStaffService = async (
//   input: CreateStaffInput
// ): Promise<{ message: string; staffId: string }> => {
//   const exists = await findUserByEmail(input.email);
//   if (exists) throw new AppError("Email already exists", 400);

//   const staffId = await generateStaffId();

//   await createUser({
//     staffId,
//     name: input.name,
//     email: input.email,
//     password: input.password,
//     role: "staff",
//     joinedOn: input.joinedOn,
//     phone: input.phone,
//   });
//   return { message: "Staff created successfully", staffId };
// };

export const getAllStaffService = async (
  page: number = 1,
  limit: number = 10,
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

// export const seedAdminService = async (): Promise<{ message: string }> => {
//   const exists = await findAdminExists();
//   if (exists) throw new AppError("Admin already exists", 400);

//   await createUser({
//     staffId: "ADMIN001",
//     name: "Admin",
//     email: "admin@company.com",
//     password: "admin123",
//     role: "admin",
//     joinedOn: new Date().toISOString().split("T")[0],
//   });

//   return {
//     message: "Admin created — email: admin@company.com password: admin123",
//   };
// };

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

// postgres

export const registerService = async (payload: registerPayload) => {
  const { companyName, industry, adminName, email, phone, password } = payload;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      const organization = await createOrganization(tx, {
        companyName,
        industry,
      });

      const userData: Prisma.UserCreateInput = {
        organization: {
          connect: {
            id: organization.id,
          },
        },

        name: adminName,
        email,
        phone,
        password: hashedPassword,
        role: "admin",
        joinedOn: new Date(),
      };

      const user = await createUser(tx, userData);

      return {
        organization,
        user,
      };
    }
  );

  const token = generateToken(
    result.user.id,
    result.user.organizationId,
    result.user.role
  );

  return {
    token,
    organization: result.organization,
    user: result.user,
  };
};
