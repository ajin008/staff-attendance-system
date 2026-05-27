import { getISTDate } from "../utils/getISTDate";
import prisma from "../utils/prisma";

export const createLeaveRequest = async (data: {
  userId: number;

  organizationId: number;

  leaveType: string;

  reason?: string;

  startDate: string;

  endDate: string;

  totalDays: number;
}) => {
  return prisma.leaveRequest.create({
    data,
  });
};

export const findLeavesByUserId = async (userId: number) => {
  return prisma.leaveRequest.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const countPendingLeavesByOrganization = async (
  organizationId: number
) => {
  return prisma.leaveRequest.count({
    where: {
      organizationId,

      status: "pending",
    },
  });
};

export const findPendingLeavesByOrganization = async (
  organizationId: number
) => {
  return prisma.leaveRequest.findMany({
    where: {
      organizationId,

      status: "pending",
    },

    include: {
      user: {
        select: {
          id: true,

          staffId: true,

          name: true,

          email: true,

          department: {
            select: {
              id: true,

              name: true,
            },
          },
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findLeaveById = async (leaveId: number) => {
  return prisma.leaveRequest.findUnique({
    where: {
      id: leaveId,
    },
  });
};

export const updateLeaveStatus = async (
  leaveId: number,
  data: {
    status: "approved" | "rejected";

    approvedBy: number;

    approvedAt: Date;
  }
) => {
  return prisma.leaveRequest.update({
    where: {
      id: leaveId,
    },

    data,
  });
};

export const findAllLeavesByOrganization = async (organizationId: number) => {
  return prisma.leaveRequest.findMany({
    where: {
      organizationId,
    },

    include: {
      user: {
        include: {
          department: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findApprovedLeaveForToday = async (userId: number) => {
  const today = getISTDate();

  console.log("Today date:", today);

  return prisma.leaveRequest.findFirst({
    where: {
      userId,

      status: {
        in: ["approved", "pending"],
      },

      startDate: {
        lte: today,
      },

      endDate: {
        gte: today,
      },
    },
  });
};

export const cancelLeaveRequest = async (leaveId: number) => {
  return prisma.leaveRequest.update({
    where: {
      id: leaveId,
    },

    data: {
      status: "cancelled",
    },
  });
};
