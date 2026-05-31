// Service/attendance.service.ts

import AppError from "../utils/AppError";

import {
  countStaffAttendance,
  findAllAttendanceSummary,
  findLateAttendanceToday,
  findPendingAutoCheckouts,
  findStaffAttendance,
  updateAttendanceCheckOut,
} from "../Repository/attendance.repository";

import { findStaffByStaffId } from "../Repository/staff.repository";
import {
  calculateEarlyExitMinutes,
  calculateShiftMinutes,
  calculateWorkedMinutes,
} from "../utils/time";
import { checkOutStaffAllocation } from "../Repository/floor.repository";

export const getStaffAttendanceService = async ({
  organizationId,
  staffId,
  page,
  limit,
  startDate,
  endDate,
}: {
  organizationId: number;

  staffId: string;

  page: number;

  limit: number;

  startDate?: string;

  endDate?: string;
}) => {
  console.log("organizationId:", organizationId);

  console.log("staffId:", staffId);
  const staff = await findStaffByStaffId(organizationId, staffId);

  console.log("Staff found:", staff);

  if (!staff) {
    throw new AppError("Staff not found", 404);
  }

  const skip = (page - 1) * limit;

  const attendance = await findStaffAttendance({
    userId: staff.id,

    skip,

    limit,

    startDate,

    endDate,
  });

  const total = await countStaffAttendance({
    userId: staff.id,

    startDate,

    endDate,
  });

  return {
    staff: {
      id: staff.id,

      staffId: staff.staffId!,

      name: staff.name,

      email: staff.email,

      department: staff.department
        ? {
            id: staff.department.id,

            name: staff.department.name,
          }
        : null,
    },

    attendance: attendance.map((record) => ({
      id: record.id,

      date: record.createdAt,

      checkInTime: record.checkInTime,

      checkOutTime: record.checkOutTime,

      status: record.attendanceStatus,

      lateMinutes: record.lateMinutes,

      isLate: record.isLate,

      branch: {
        id: record.branch.id,

        name: record.branch.name,
      },

      workHours: Number((record.totalWorkMinutes / 60).toFixed(2)),
    })),

    pagination: {
      total,

      page,

      limit,

      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getMyAttendanceService = async ({
  userId,
  page,
  limit,
  startDate,
  endDate,
}: {
  userId: number;

  page: number;

  limit: number;

  startDate?: string;

  endDate?: string;
}) => {
  const skip = (page - 1) * limit;

  // FETCH ATTENDANCE
  const attendance = await findStaffAttendance({
    userId,

    skip,

    limit,

    startDate,

    endDate,
  });

  // COUNT
  const total = await countStaffAttendance({
    userId,

    startDate,

    endDate,
  });

  // SUMMARY
  const allAttendance = await findAllAttendanceSummary({
    userId,

    startDate,

    endDate,
  });

  const presentDays = allAttendance.filter(
    (a) => a.attendanceStatus === "present"
  ).length;

  const absentDays = allAttendance.filter(
    (a) => a.attendanceStatus === "absent"
  ).length;

  const lateDays = allAttendance.filter((a) => a.isLate).length;

  const totalWorkHours = allAttendance.reduce(
    (sum, item) => sum + item.totalWorkMinutes / 60,
    0
  );

  return {
    attendance: attendance.map((record) => ({
      id: record.id,

      date: record.createdAt,

      checkInTime: record.checkInTime,

      checkOutTime: record.checkOutTime,

      status: record.attendanceStatus,

      lateMinutes: record.lateMinutes,

      isLate: record.isLate,

      workHours: Number((record.totalWorkMinutes / 60).toFixed(2)),

      branch: {
        id: record.branch.id,

        name: record.branch.name,
      },
    })),

    summary: {
      totalDays: allAttendance.length,

      presentDays,

      absentDays,

      lateDays,

      totalWorkHours: Number(totalWorkHours.toFixed(2)),
    },

    pagination: {
      page,

      limit,

      total,

      totalPages: Math.ceil(total / limit),
    },
  };
};

// cron job to auto checkout staff who forgot to checkout by the end of the day

export const autoCheckOutStaffService = async () => {
  console.log("Running auto checkout...");

  const attendances = await findPendingAutoCheckouts();

  for (const attendance of attendances) {
    // SHIFT END
    const shiftEnd = attendance.shiftEnd || "17:00";

    // TODAY DATE
    const attendanceDate = new Date(attendance.createdAt);

    // SHIFT END DATE
    const autoCheckoutTime = new Date(attendanceDate);

    const [shiftHour, shiftMinute] = shiftEnd.split(":").map(Number);

    autoCheckoutTime.setHours(
      shiftHour + 3, // 3 HOUR GAP
      shiftMinute,
      0,
      0
    );

    // CURRENT TIME
    const now = new Date();

    // NOT YET AUTO CHECKOUT TIME
    if (now < autoCheckoutTime) {
      continue;
    }

    // WORK MINUTES
    const totalWorkMinutes = calculateWorkedMinutes(
      attendance.checkInTime!,
      autoCheckoutTime
    );

    // SHIFT MINUTES
    const shiftMinutes = calculateShiftMinutes(
      attendance.shiftStart!,
      attendance.shiftEnd!
    );

    // HALF DAY
    const isHalfDay = totalWorkMinutes < shiftMinutes / 2;

    // EARLY EXIT
    const earlyExitMinutes = calculateEarlyExitMinutes(
      attendance.shiftEnd!,
      autoCheckoutTime
    );

    // UPDATE ATTENDANCE
    await updateAttendanceCheckOut(attendance.id, {
      checkOutTime: autoCheckoutTime,

      totalWorkMinutes,

      overtimeMinutes: 0,

      isOvertime: false,

      earlyExitMinutes,

      isEarlyExit: earlyExitMinutes > 0,

      isHalfDay,

      isAutoCheckout: true,

      attendanceStatus: isHalfDay ? "half_day" : "present",
    });

    // REMOVE FLOOR ALLOCATION
    await checkOutStaffAllocation(attendance.userId);

    console.log(`Auto checkout completed for user ${attendance.userId}`);
  }
};

export const getLateAttendanceService = async (organizationId: number) => {
  return findLateAttendanceToday(organizationId);
};
