import prisma from "../utils/prisma";

export const countStaffByOrganization = async (organizationId: number) => {
  return prisma.user.count({
    where: {
      organizationId,

      role: "staff",
    },
  });
};

export const countDepartmentByOrganization = async (organizationId: number) => {
  return prisma.department.count({
    where: {
      organizationId,
    },
  });
};

const getTodayRange = () => {
  const startOfDay = new Date();

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();

  endOfDay.setHours(23, 59, 59, 999);

  return {
    startOfDay,
    endOfDay,
  };
};

export const findTodayPresentStaff = async (organizationId: number) => {
  const { startOfDay, endOfDay } = getTodayRange();

  return prisma.attendance.findMany({
    where: {
      organizationId,

      checkInTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },

    select: {
      id: true,

      checkInTime: true,

      isLate: true,

      lateMinutes: true,

      user: {
        select: {
          id: true,

          staffId: true,

          name: true,

          email: true,
        },
      },

      branch: {
        select: {
          id: true,

          name: true,
        },
      },
    },

    orderBy: {
      checkInTime: "desc",
    },
  });
};

export const findTodayLateStaff = async (organizationId: number) => {
  const { startOfDay, endOfDay } = getTodayRange();

  return prisma.attendance.findMany({
    where: {
      organizationId,

      isLate: true,

      checkInTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },

    select: {
      id: true,

      checkInTime: true,

      lateMinutes: true,

      user: {
        select: {
          id: true,

          staffId: true,

          name: true,
        },
      },
    },

    orderBy: {
      lateMinutes: "desc",
    },
  });
};

export const findAbsentStaff = async (organizationId: number) => {
  const { startOfDay, endOfDay } = getTodayRange();

  // FIND STAFF WHO HAVE ATTENDANCE TODAY
  const attendedUsers = await prisma.attendance.findMany({
    where: {
      organizationId,

      checkInTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },

    select: {
      userId: true,
    },
  });

  const attendedUserIds = attendedUsers.map((attendance) => attendance.userId);

  // FIND ABSENT STAFF
  return prisma.user.findMany({
    where: {
      organizationId,

      role: "staff",

      id: {
        notIn: attendedUserIds,
      },
    },

    select: {
      id: true,

      staffId: true,

      name: true,

      email: true,
    },

    orderBy: {
      name: "asc",
    },
  });
};
