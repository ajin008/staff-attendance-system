import prisma from "../utils/prisma";

export const createAttendance = async (data: any) => {
  return prisma.attendance.create({
    data,
  });
};

export const findTodayAttendanceByUserId = async (userId: number) => {
  const startOfDay = new Date();

  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();

  endOfDay.setHours(23, 59, 59, 999);

  return prisma.attendance.findFirst({
    where: {
      userId,

      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
    include: {
      branch: true,
    },
  });
};

export const updateAttendanceCheckOut = async (
  attendanceId: number,
  data: any
) => {
  return prisma.attendance.update({
    where: {
      id: attendanceId,
    },

    data,
  });
};

export const findStaffAttendance = async ({
  userId,
  skip,
  limit,
  startDate,
  endDate,
}: {
  userId: number;

  skip: number;

  limit: number;

  startDate?: string;

  endDate?: string;
}) => {
  return prisma.attendance.findMany({
    where: {
      userId,

      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),

            lte: new Date(endDate),
          },
        }),
    },

    include: {
      branch: true,
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const countStaffAttendance = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;

  startDate?: string;

  endDate?: string;
}) => {
  return prisma.attendance.count({
    where: {
      userId,

      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),

            lte: new Date(endDate),
          },
        }),
    },
  });
};

export const findAllAttendanceSummary = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;

  startDate?: string;

  endDate?: string;
}) => {
  return prisma.attendance.findMany({
    where: {
      userId,

      ...(startDate &&
        endDate && {
          createdAt: {
            gte: new Date(startDate),

            lte: new Date(endDate),
          },
        }),
    },
  });
};

export const findPendingAutoCheckouts = async () => {
  return prisma.attendance.findMany({
    where: {
      checkOutTime: null,
    },

    include: {
      user: {
        include: {
          department: true,
        },
      },
    },
  });
};

export const findLateAttendanceToday = async (organizationId: number) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const attendances = await prisma.attendance.findMany({
    where: {
      organizationId,

      createdAt: {
        gte: startOfDay,
        lte: endOfDay,
      },

      checkInTime: {
        not: null,
      },
    },

    include: {
      user: {
        include: {
          department: true,
        },
      },
    },

    orderBy: {
      checkInTime: "desc",
    },
  });

  return attendances
    .map((attendance) => {
      const user = attendance.user;

      if (!attendance.checkInTime || !user.department?.shiftStart) {
        return null;
      }

      const [hours, minutes] = user.department.shiftStart.split(":");

      const shiftStart = new Date(attendance.checkInTime);

      shiftStart.setHours(Number(hours), Number(minutes), 0, 0);

      const lateMinutes = Math.floor(
        (attendance.checkInTime.getTime() - shiftStart.getTime()) / (1000 * 60)
      );

      if (lateMinutes <= 0) {
        return null;
      }

      return {
        id: user.id,

        staffId: user.staffId,

        name: user.name,

        email: user.email,

        phone: user.phone,

        checkInTime: attendance.checkInTime,

        lateMinutes,
      };
    })
    .filter(Boolean);
};
