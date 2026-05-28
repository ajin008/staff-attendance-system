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
