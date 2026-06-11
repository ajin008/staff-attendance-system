// Service/leave.service.ts

import AppError from "../utils/AppError.js";

import {
  createLeaveRequest,
  findLeavesByUserId,
} from "../Repository/leave.repository.js";

import {
  findLeaveById,
  updateLeaveStatus,
} from "../Repository/leave.repository.js";

import { findAllLeavesByOrganization } from "../Repository/leave.repository.js";
import { nowUTC } from "../utils/nowUTC.js";
// import { nowIST } from "../utils/nowIST.js";

export const createLeaveRequestService = async ({
  userId,
  organizationId,
  leaveType,
  reason,
  startDate,
  endDate,
}: {
  userId: number;

  organizationId: number;

  leaveType: string;

  reason?: string;

  startDate: string;

  endDate: string;
}) => {
  // REQUIRED FIELDS
  if (!leaveType || !startDate || !endDate) {
    throw new AppError("All required fields missing", 400);
  }

  console.log("Received leave request data:", {
    startDate,
    endDate,
  });

  // VALIDATE DATES
  if (startDate > endDate) {
    throw new AppError("Start date cannot be after end date", 400);
  }

  // TOTAL DAYS
  const totalDays =
    Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  // CREATE REQUEST
  const leaveRequest = await createLeaveRequest({
    userId,

    organizationId,

    leaveType,

    reason,

    startDate,

    endDate,

    totalDays,
  });

  return leaveRequest;
};

export const getMyLeavesService = async (userId: number) => {
  const leaves = await findLeavesByUserId(userId);

  return leaves.map((leave) => ({
    id: leave.id,

    leaveType: leave.leaveType,

    reason: leave.reason,

    startDate: leave.startDate,

    endDate: leave.endDate,

    totalDays: leave.totalDays,

    status: leave.status,

    approvedAt: leave.approvedAt,

    createdAt: leave.createdAt,
  }));
};

export const updateLeaveStatusService = async ({
  leaveId,
  approvedBy,
  status,
}: {
  leaveId: number;

  approvedBy: number;

  status: "approved" | "rejected";
}) => {
  // VALIDATION
  if (status !== "approved" && status !== "rejected") {
    throw new AppError("Invalid leave status", 400);
  }

  // FIND LEAVE
  const leave = await findLeaveById(leaveId);

  if (!leave) {
    throw new AppError("Leave request not found", 404);
  }

  // PREVENT DOUBLE ACTION
  if (leave.status !== "pending") {
    throw new AppError("Leave request already processed", 400);
  }

  // UPDATE STATUS
  await updateLeaveStatus(leaveId, {
    status,

    approvedBy,

    approvedAt: nowUTC(),
  });

  return {
    message: `Leave request ${status} successfully`,
  };
};

export const getAllLeavesService = async (organizationId: number) => {
  const leaves = await findAllLeavesByOrganization(organizationId);

  return {
    pendingLeave: leaves.filter((leave) => leave.status === "pending").length,

    pendingLeaveRequests: leaves.map((leave) => ({
      id: leave.id,

      leaveType: leave.leaveType,

      reason: leave.reason,

      startDate: leave.startDate,

      endDate: leave.endDate,

      totalDays: leave.totalDays,

      status: leave.status,

      approvedAt: leave.approvedAt,

      createdAt: leave.createdAt,

      user: {
        id: leave.user.id,

        staffId: leave.user.staffId!,

        name: leave.user.name,

        email: leave.user.email,

        department: leave.user.department
          ? {
              id: leave.user.department.id,

              name: leave.user.department.name,
            }
          : undefined,
      },
    })),
  };
};
