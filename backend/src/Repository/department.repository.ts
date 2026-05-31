import prisma from "../utils/prisma.js";

export const createDepartment = async (data: {
  organizationId: number;

  name: string;

  shiftStart: string;

  shiftEnd: string;

  weeklyOffDays: string[];

  overtimeEnabled: boolean;

  overtimeGraceMins: number;

  overtimeHourlyRate?: number;

  defaultSalary: number;
}) => {
  return prisma.department.create({
    data,
  });
};

export const findDepartmentByOrganizationId = async (
  organizationId: number,
  skip: number,
  limit: number,
  search: string
) => {
  return prisma.department.findMany({
    where: {
      organizationId,

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },

    include: {
      users: true,
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findDepartmentById = async (
  organizationId: number,
  departmentId: number
) => {
  return prisma.department.findFirst({
    where: {
      id: departmentId,

      organizationId,
    },

    include: {
      users: true,
    },
  });
};

export const deleteDepartmentById = async (
  organizationId: number,
  departmentId: number
) => {
  return prisma.department.deleteMany({
    where: {
      id: departmentId,

      organizationId,
    },
  });
};

export const updateDepartmentById = async (
  organizationId: number,
  departmentId: number,
  data: any
) => {
  return prisma.department.updateMany({
    where: {
      id: departmentId,

      organizationId,
    },

    data,
  });
};

export const countDepartmentByOrganization = async (
  organizationId: number,
  search: string
) => {
  return prisma.department.count({
    where: {
      organizationId,

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),
    },
  });
};

export const updateDepartmentStatus = async (
  departmentId: number,
  isActive: boolean
) => {
  return prisma.department.update({
    where: {
      id: departmentId,
    },

    data: {
      isActive,
    },
  });
};
