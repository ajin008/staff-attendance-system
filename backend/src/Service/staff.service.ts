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

import { updateAttendanceCheckOut } from "../Repository/attendance.repository";
import {
  calculateEarlyExitMinutes,
  calculateLateMinutes,
  calculateOvertimeMinutes,
  calculateShiftMinutes,
  calculateWorkedMinutes,
  parseTimeToMinutes,
} from "../utils/time";

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

// UPDATED checkInStaffService

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
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.branchId || !user.branch) {
    throw new AppError("User branch not assigned", 400);
  }

  if (!user.department) {
    throw new AppError("User department not assigned", 400);
  }

  const existingAttendance = await findTodayAttendanceByUserId(userId);

  if (existingAttendance) {
    throw new AppError("Already checked in today", 400);
  }

  const distance = calculateDistanceInMeters(
    latitude,
    longitude,
    user.branch.latitude,
    user.branch.longitude
  );

  if (distance > user.branch.allowedRadius) {
    throw new AppError("You are outside allowed office radius", 400);
  }

  const now = new Date();

  const effectiveShiftStart = user.shiftStart || user.department.shiftStart;
  console.log("Effective Shift Start:", effectiveShiftStart);

  const effectiveShiftEnd = user.shiftEnd || user.department.shiftEnd;
  console.log("Effective Shift End:", effectiveShiftEnd);

  // CURRENT TIME IN MINUTES
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // SHIFT END IN MINUTES
  const shiftStartMinutes = parseTimeToMinutes(effectiveShiftStart);

  if (currentMinutes < shiftStartMinutes) {
    // console.log(
    //   "currentMinutes:",
    //   currentMinutes,
    //   "shiftEndMinutes:",
    //   shiftEndMinutes
    // );

    throw new AppError("Shift not yet started. Check-in not allowed.", 400);
  }

  const lateMinutes = calculateLateMinutes(
    effectiveShiftStart,
    now,
    user.department.overtimeGraceMins
  );

  const attendance = await createAttendance({
    userId,

    organizationId,

    branchId: user.branchId,

    checkInLatitude: latitude,

    checkInLongitude: longitude,

    checkInTime: now,

    shiftStart: user.department.shiftStart,

    shiftEnd: user.department.shiftEnd,

    attendanceStatus: "present",

    lateMinutes,

    isLate: lateMinutes > 0,
  });

  return {
    message: "Check-in successful",

    attendance: {
      id: attendance.id,

      attendanceStatus: attendance.attendanceStatus,

      checkInTime: attendance.checkInTime,

      lateMinutes: attendance.lateMinutes,

      isLate: attendance.isLate,

      branch: {
        id: user.branch.id,

        name: user.branch.name,
      },
    },
  };
};

// UPDATED checkOutStaffService

export const checkOutStaffService = async ({
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
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.branchId || !user.branch) {
    throw new AppError("User branch not assigned", 400);
  }

  const attendance = await findTodayAttendanceByUserId(userId);

  if (!attendance) {
    throw new AppError("No active check-in found", 400);
  }

  if (attendance.checkOutTime) {
    throw new AppError("Already checked out today", 400);
  }

  const distance = calculateDistanceInMeters(
    latitude,
    longitude,
    user.branch.latitude,
    user.branch.longitude
  );

  if (distance > user.branch.allowedRadius) {
    throw new AppError("You are outside allowed office radius", 400);
  }

  const checkOutTime = new Date();

  const totalWorkMinutes = calculateWorkedMinutes(
    attendance.checkInTime!,
    checkOutTime
  );

  const overtimeMinutes = calculateOvertimeMinutes(
    attendance.shiftEnd!,
    checkOutTime
  );

  const earlyExitMinutes = calculateEarlyExitMinutes(
    attendance.shiftEnd!,
    checkOutTime
  );

  const shiftMinutes = calculateShiftMinutes(
    attendance.shiftStart!,
    attendance.shiftEnd!
  );

  const halfDayThreshold = shiftMinutes / 2;

  const isHalfDay = totalWorkMinutes < halfDayThreshold;

  const updatedAttendance = await updateAttendanceCheckOut(attendance.id, {
    checkOutTime,

    checkOutLatitude: latitude,

    checkOutLongitude: longitude,

    totalWorkMinutes,

    overtimeMinutes,

    earlyExitMinutes,

    isOvertime: overtimeMinutes > 0,

    isEarlyExit: earlyExitMinutes > 0,

    isHalfDay,

    attendanceStatus: isHalfDay ? "half_day" : "present",
  });

  return {
    message: "Check-out successful",

    attendance: {
      id: updatedAttendance.id,

      attendanceStatus: updatedAttendance.attendanceStatus,

      checkInTime: updatedAttendance.checkInTime,

      checkOutTime: updatedAttendance.checkOutTime,

      totalWorkMinutes: updatedAttendance.totalWorkMinutes,

      overtimeMinutes: updatedAttendance.overtimeMinutes,

      earlyExitMinutes: updatedAttendance.earlyExitMinutes,

      isHalfDay: updatedAttendance.isHalfDay,

      isOvertime: updatedAttendance.isOvertime,

      isEarlyExit: updatedAttendance.isEarlyExit,

      branch: {
        id: user.branch.id,

        name: user.branch.name,
      },
    },
  };
};

export const getTodayAttendanceService = async (userId: number) => {
  const attendance = await findTodayAttendanceByUserId(userId);

  // NO ATTENDANCE TODAY
  if (!attendance) {
    return {
      checkedIn: false,

      checkedOut: false,

      attendance: null,
    };
  }

  // CHECKED IN ONLY
  if (attendance.checkInTime && !attendance.checkOutTime) {
    return {
      checkedIn: true,

      checkedOut: false,

      attendance: {
        id: attendance.id,

        checkInTime: attendance.checkInTime,

        attendanceStatus: attendance.attendanceStatus,

        shiftStart: attendance.shiftStart,

        shiftEnd: attendance.shiftEnd,

        lateMinutes: attendance.lateMinutes,

        isLate: attendance.isLate,

        branch: {
          id: attendance.branch.id,

          name: attendance.branch.name,
        },
      },
    };
  }

  // CHECKED OUT
  return {
    checkedIn: true,

    checkedOut: true,

    attendance: {
      id: attendance.id,

      checkInTime: attendance.checkInTime,

      checkOutTime: attendance.checkOutTime,

      attendanceStatus: attendance.attendanceStatus,

      shiftStart: attendance.shiftStart,

      shiftEnd: attendance.shiftEnd,

      totalWorkMinutes: attendance.totalWorkMinutes,

      lateMinutes: attendance.lateMinutes,

      overtimeMinutes: attendance.overtimeMinutes,

      earlyExitMinutes: attendance.earlyExitMinutes,

      isLate: attendance.isLate,

      isOvertime: attendance.isOvertime,

      isEarlyExit: attendance.isEarlyExit,

      isHalfDay: attendance.isHalfDay,

      branch: {
        id: attendance.branch.id,

        name: attendance.branch.name,
      },
    },
  };
};
