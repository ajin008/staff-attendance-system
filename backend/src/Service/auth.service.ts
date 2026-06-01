import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateStaffId } from "../utils/staffId.js";

import AppError from "../utils/AppError.js";
import generateToken from "../utils/generateToken.js";
import { LoginResult, registerPayload } from "../utils/types.js";
import { findUserByEmail } from "../Repository/user.repository.js";
import prisma from "../utils/prisma.js";
import { createOrganization } from "../Repository/organization.repository.js";
import { createUser } from "../Repository/user.repository.js";
import { findUserByStaffId } from "../Repository/user.repository.js";
import { Prisma } from "@prisma/client";
import { createBranches } from "../Repository/branch.repository.js";
import { nowIST } from "../utils/nowIST.js";

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

  if (!user.isActive)
    throw new AppError(
      "Account is deactivated. Please contact administrator.",
      403
    );

  const isMatch = await bcrypt.compare(password, user.password);
  console.log("Password match:", isMatch);

  if (!isMatch) throw new AppError("invalid password", 401);

  const token = generateToken(user.id, user.organizationId, user.role);

  return {
    token,

    user: {
      id: user.id,

      organizationId: user.organizationId,

      companyName: user.organization.companyName,

      staffId: user.staffId,

      name: user.name,

      email: user.email,

      phone: user.phone,

      role: user.role,

      joinedOn: user.joinedOn,
    },
  };
};

// postgres

export const registerService = async (payload: registerPayload) => {
  const { companyName, industry, adminName, email, phone, password, branches } =
    payload;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const result = await prisma.$transaction(
    async (tx: Prisma.TransactionClient) => {
      // CREATE ORGANIZATION
      const organization = await createOrganization(tx, {
        companyName,
        industry,
      });

      // CREATE BRANCHES
      if (branches.length > 0) {
        await createBranches(
          tx,
          branches.map((branch) => ({
            organizationId: organization.id,

            name: branch.name,

            latitude: branch.latitude,

            longitude: branch.longitude,
          }))
        );
      }

      // CREATE ADMIN USER
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

        joinedOn: nowIST(),
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
