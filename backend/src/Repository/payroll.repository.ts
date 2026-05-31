import prisma from "../utils/prisma.js";

export const findPayrollStaff = async ({
  organizationId,
  search,
  skip,
  limit,
}: {
  organizationId: number;

  search?: string;

  skip: number;

  limit: number;
}) => {
  return prisma.user.findMany({
    where: {
      organizationId,

      role: "staff",

      OR: search
        ? [
            {
              name: {
                contains: search,

                mode: "insensitive",
              },
            },

            {
              staffId: {
                contains: search,

                mode: "insensitive",
              },
            },
          ]
        : undefined,
    },

    include: {
      department: true,
      branch: true,
    },

    skip,

    take: limit,
  });
};

export const countPayrollStaff = async (
  organizationId: number,
  search?: string
) => {
  return prisma.user.count({
    where: {
      organizationId,

      role: "staff",

      OR: search
        ? [
            {
              name: {
                contains: search,

                mode: "insensitive",
              },
            },

            {
              staffId: {
                contains: search,

                mode: "insensitive",
              },
            },
          ]
        : undefined,
    },
  });
};

export const findAttendanceByDateRange = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;

  startDate: Date;

  endDate: Date;
}) => {
  return prisma.attendance.findMany({
    where: {
      userId,

      createdAt: {
        gte: startDate,

        lte: endDate,
      },
    },
  });
};

export const createPayroll = async (data: {
  userId: number;

  organizationId: number;

  payrollStartDate: Date;

  payrollEndDate: Date;

  basicSalary: number;

  presentDays: number;

  absentDays: number;

  halfDays: number;

  overtimeMinutes: number;

  deductions: number;

  overtimePay: number;

  netSalary: number;
}) => {
  return prisma.payroll.create({
    data,
  });
};

export const updatePayrollPdf = async (payrollId: number, pdfUrl: string) => {
  return prisma.payroll.update({
    where: {
      id: payrollId,
    },

    data: {
      pdfUrl,
    },
  });
};
