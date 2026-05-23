import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

import AppError from "../utils/AppError";

import { createUser, findUserByEmail } from "../Repository/user.repository";

import { generateStaffId } from "../utils/staffId";

import { CreateStaffInput } from "../utils/types";
import {
  findAllStaffByOrganization,
  countStaffByOrganization,
} from "../Repository/user.repository";

import {
  deleteStaffByStaffId,
  findStaffByStaffId,
  updateStaffByStaffId,
} from "../Repository/staff.repository";

export const createStaffService = async (
  input: CreateStaffInput
): Promise<{ message: string; staffId: string }> => {
  const exists = await findUserByEmail(input.email);

  if (exists) {
    throw new AppError("Email already exists", 400);
  }

  const staffId = await generateStaffId();

  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const userData: Prisma.UserCreateInput = {
      organization: {
        connect: {
          id: input.organizationId,
        },
      },

      department: {
        connect: {
          id: input.departmentId,
        },
      },

      staffId,

      name: input.name,

      email: input.email,

      phone: input.phone,

      branch: input.branch,

      password: input.password,

      role: "staff",

      joinedOn: input.joinedOn,

      // OPTIONAL OVERRIDES
      shiftStart: input.shiftStart,

      shiftEnd: input.shiftEnd,

      salary: input.salary,

      overtimeEnabled: input.overtimeEnabled,

      overtimeHourlyRate: input.overtimeHourlyRate,

      overtimeGraceMins: input.overtimeGraceMins,
    };

    await createUser(tx, userData);
  });

  return {
    message: "Staff created successfully",
    staffId,
  };
};

export const getAllStaffService = async (
  organizationId: number,
  page: number,
  limit: number,
  search: string
) => {
  const skip = (page - 1) * limit;

  const staffs = await findAllStaffByOrganization(
    organizationId,
    skip,
    limit,
    search
  );

  const totalStaff = await countStaffByOrganization(organizationId, search);

  return {
    staffs,

    pagination: {
      total: totalStaff,

      page,

      limit,

      totalPages: Math.ceil(totalStaff / limit),
    },
  };
};

export const getStaffByIdService = async (
  organizationId: number,
  staffId: string
) => {
  const staff = await findStaffByStaffId(organizationId, staffId);

  if (!staff) {
    throw new AppError("Staff not found", 404);
  }

  return staff;
};

export const deleteStaffService = async (
  organizationId: number,
  staffId: string
) => {
  const staff = await findStaffByStaffId(organizationId, staffId);

  if (!staff) {
    throw new AppError("Staff not found", 404);
  }

  await deleteStaffByStaffId(organizationId, staffId);

  return {
    message: "Staff deleted successfully",
  };
};

export const updateStaffService = async (
  organizationId: number,
  staffId: string,
  data: any
) => {
  const staff = await findStaffByStaffId(organizationId, staffId);

  if (!staff) {
    throw new AppError("Staff not found", 404);
  }

  await updateStaffByStaffId(organizationId, staffId, data);

  return {
    message: "Staff updated successfully",
  };
};
