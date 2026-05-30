import AppError from "../utils/AppError";
import {
  countDepartmentByOrganization,
  countStaffByOrganization,
} from "../Repository/admin.repository";

import {
  findTodayPresentStaff,
  findTodayLateStaff,
  findAbsentStaff,
} from "../Repository/admin.repository";

import {
  countPendingLeavesByOrganization,
  findPendingLeavesByOrganization,
} from "../Repository/leave.repository";


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


