import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

import AppError from "../utils/AppError";

import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../Repository/user.repository";

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
import bcrypt from "bcryptjs";
import {
  createAttendance,
  findTodayAttendanceByUserId,
} from "../Repository/attendance.repository";
import { calculateDistanceInMeters } from "../utils/location";

export const createStaffService = async (
  input: CreateStaffInput
): Promise<{ message: string; staffId: string }> => {
  const exists = await findUserByEmail(input.email);

  if (exists) {
    throw new AppError("Email already exists", 400);
  }

  const staffId = await generateStaffId();

  const hashedPassword = await bcrypt.hash(input.password, 12);

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

      branch: {
        connect: {
          id: input.branchId,
        },
      },

      staffId,

      name: input.name,

      email: input.email,

      phone: input.phone,

      password: hashedPassword,

      role: "staff",

      joinedOn: input.joinedOn,

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

export const checkInStaffService = async ({
  userId,
  organizationId,
  latitude,
  longitude,
}: {
  userId: number;

  organizationId: number;

  latitude: number;

  longitude: number;
}) => {
  // FIND USER
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  // USER MUST HAVE BRANCH
  if (!user.branchId || !user.branch) {
    throw new AppError("User branch not assigned", 400);
  }

  // CHECK ALREADY CHECKED IN TODAY
  const existingAttendance = await findTodayAttendanceByUserId(userId);

  if (existingAttendance) {
    throw new AppError("Already checked in today", 400);
  }

  // CALCULATE DISTANCE
  const distance = calculateDistanceInMeters(
    latitude,
    longitude,
    user.branch.latitude,
    user.branch.longitude
  );

  // VALIDATE RADIUS
  if (distance > user.branch.allowedRadius) {
    throw new AppError("You are outside allowed office radius", 400);
  }

  // CREATE ATTENDANCE
  const attendance = await createAttendance({
    userId,

    organizationId,

    branchId: user.branchId,

    checkInLatitude: latitude,

    checkInLongitude: longitude,

    checkInTime: new Date(),

    status: "present",
  });

  return {
    message: "Check-in successful",

    attendance,
  };
};
