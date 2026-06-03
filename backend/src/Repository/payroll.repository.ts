import prisma from "../utils/prisma.js";

export const findPayrollStaff = async ({
  organizationId,
  search,
  department,
  skip,
  limit,
}: {
  organizationId: number;
  search?: string;
  department?: string;
  skip: number;
  limit: number;
}) => {
  return prisma.user.findMany({
    where: {
      organizationId,

      role: "staff",

      ...(department &&
        department !== "all" && {
          departmentId: Number(department),
        }),

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
    },

    skip,
    take: limit,
  });
};

export const countPayrollStaff = async (
  organizationId: number,
  search?: string,
  department?: string
) => {
  return prisma.user.count({
    where: {
      organizationId,

      role: "staff",

      ...(department &&
        department !== "all" && {
          departmentId: Number(department),
        }),

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

//find approved leaves for a user in a date range
export const findApprovedLeavesByDateRange = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;
  startDate: string;
  endDate: string;
}) => {
  return prisma.leaveRequest.findMany({
    where: {
      userId,

      status: "approved",

      startDate: {
        lte: endDate,
      },

      endDate: {
        gte: startDate,
      },
    },
  });
};

export const findPayrollStaffByStaffId = async ({
  organizationId,
  staffId,
}: {
  organizationId: number;
  staffId: string;
}) => {
  return prisma.user.findFirst({
    where: {
      organizationId,
      staffId,
      role: "staff",
    },

    include: {
      department: true,
    },
  });
};

export const findExistingPayroll = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;
  startDate: Date;
  endDate: Date;
}) => {
  return prisma.payroll.findFirst({
    where: {
      userId,
      payrollStartDate: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
};
export const findPayrollByMonth = async ({
  userId,
  startDate,
  endDate,
}: {
  userId: number;
  startDate: Date;
  endDate: Date;
}) => {
  return prisma.payroll.findFirst({
    where: {
      userId,

      payrollStartDate: startDate,

      payrollEndDate: endDate,
    },

    select: {
      id: true,
      pdfUrl: true,
    },
  });
};

export const getPayrollSummary = async ({
  organizationId,
  startDate,
  endDate,
}: {
  organizationId: number;
  startDate: Date;
  endDate: Date;
}) => {
  return prisma.payroll.aggregate({
    where: {
      organizationId,
      payrollStartDate: startDate,
      payrollEndDate: endDate,
    },

    _sum: {
      netSalary: true,
    },

    _count: {
      id: true,
    },
  });
};
