import AppError from "../utils/AppError.js";
import {
  countDepartmentByOrganization,
  countStaffByOrganization,
} from "../Repository/admin.repository.js";

import {
  findTodayPresentStaff,
  findTodayLateStaff,
  findAbsentStaff,
  findPresentStaffByDate,
  findLateStaffByDate,
  findAbsentStaffByDate,
} from "../Repository/admin.repository.js";

import {
  countPendingLeavesByOrganization,
  findPendingLeavesByOrganization,
} from "../Repository/leave.repository.js";

export const getTodayAttendanceDataService = async (organizationId: number) => {
  const [presentStaff, lateStaff, absentStaff] = await Promise.all([
    findTodayPresentStaff(organizationId),

    findTodayLateStaff(organizationId),

    findAbsentStaff(organizationId),
  ]);

  return {
    present: {
      count: presentStaff.length,

      staff: presentStaff,
    },

    absent: {
      count: absentStaff.length,

      staff: absentStaff,
    },

    late: {
      count: lateStaff.length,

      staff: lateStaff,
    },
  };
};

export const adminStatusService = async (
  userId: number,
  organizationId: number
) => {
  const totalStaff = await countStaffByOrganization(organizationId);

  const totalDepartments = await countDepartmentByOrganization(organizationId);

  const pendingLeave = await countPendingLeavesByOrganization(organizationId);

  const pendingLeaveRequests = await findPendingLeavesByOrganization(
    organizationId
  );

  return {
    totalStaff,

    totalDepartments,

    pendingLeave,

    pendingLeaveRequests,
  };
};

export const getAttendanceDataByDateService = async (
  organizationId: number,
  dateStr: string,
  branchId?: number,
  departmentId?: number
) => {
  // Parse YYYY-MM-DD local date range
  const parts = dateStr.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const startOfDay = new Date(year, month, day, 0, 0, 0, 0);
  const endOfDay = new Date(year, month, day, 23, 59, 59, 999);

  const [presentStaff, lateStaff, absentStaff] = await Promise.all([
    findPresentStaffByDate(organizationId, startOfDay, endOfDay, branchId, departmentId),
    findLateStaffByDate(organizationId, startOfDay, endOfDay, branchId, departmentId),
    findAbsentStaffByDate(organizationId, startOfDay, endOfDay, branchId, departmentId),
  ]);

  return {
    present: {
      count: presentStaff.length,
      staff: presentStaff,
    },
    absent: {
      count: absentStaff.length,
      staff: absentStaff,
    },
    late: {
      count: lateStaff.length,
      staff: lateStaff,
    },
  };
};

