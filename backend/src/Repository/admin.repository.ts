import prisma from "../utils/prisma.js";

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
export const findPresentStaffByDate = async (
  organizationId: number,
  startOfDay: Date,
  endOfDay: Date,
  branchId?: number,
  departmentId?: number
) => {
  const whereClause: any = {
    organizationId,
    checkInTime: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  if (branchId) {
    whereClause.branchId = branchId;
  }

  if (departmentId) {
    whereClause.user = {
      departmentId: departmentId,
    };
  }

  return prisma.attendance.findMany({
    where: whereClause,
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

export const findLateStaffByDate = async (
  organizationId: number,
  startOfDay: Date,
  endOfDay: Date,
  branchId?: number,
  departmentId?: number
) => {
  const whereClause: any = {
    organizationId,
    isLate: true,
    checkInTime: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  if (branchId) {
    whereClause.branchId = branchId;
  }

  if (departmentId) {
    whereClause.user = {
      departmentId: departmentId,
    };
  }

  return prisma.attendance.findMany({
    where: whereClause,
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

export const findAbsentStaffByDate = async (
  organizationId: number,
  startOfDay: Date,
  endOfDay: Date,
  branchId?: number,
  departmentId?: number
) => {
  const attendedWhereClause: any = {
    organizationId,
    checkInTime: {
      gte: startOfDay,
      lte: endOfDay,
    },
  };

  if (branchId) {
    attendedWhereClause.branchId = branchId;
  }

  if (departmentId) {
    attendedWhereClause.user = {
      departmentId: departmentId,
    };
  }

  const attendedUsers = await prisma.attendance.findMany({
    where: attendedWhereClause,
    select: {
      userId: true,
    },
  });

  const attendedUserIds = attendedUsers.map((attendance) => attendance.userId);

  const userWhereClause: any = {
    organizationId,
    role: "staff",
    id: {
      notIn: attendedUserIds,
    },
  };

  if (branchId) {
    userWhereClause.branchId = branchId;
  }

  if (departmentId) {
    userWhereClause.departmentId = departmentId;
  }

  return prisma.user.findMany({
    where: userWhereClause,
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

export const updateAdminProfile = async (userId: number, data: any) => {
  return prisma.user.update({
    where: {
      id: userId,
    },

    data,
  });
};
