import prisma from "../utils/prisma";

export const createAttendance = async (data: {
  userId: number;

  organizationId: number;

  branchId: number;

  checkInLatitude: number;

  checkInLongitude: number;

  checkInTime: Date;

  status: string;
}) => {
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
  });
};
