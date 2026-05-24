import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const createUser = async (
  tx: Prisma.TransactionClient,
  data: Prisma.UserCreateInput
) => {
  return tx.user.create({
    data: data,
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const findUserByStaffId = async (staffId: string) => {
  return prisma.user.findFirst({
    where: {
      staffId,
    },
  });
};

export const findUserById = async (id: number) => {
  return prisma.user.findUnique({
    where: {
      id,
    },

    include: {
      branch: true,
    },
  });
};

export const findAllStaffByOrganization = async (
  organizationId: number,
  skip: number,
  limit: number,
  search: string
) => {
  return prisma.user.findMany({
    where: {
      organizationId,

      role: "staff",

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            email: {
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
        ],
      }),
    },

    select: {
      id: true,

      staffId: true,

      name: true,

      email: true,

      phone: true,

      role: true,

      joinedOn: true,

      createdAt: true,

      updatedAt: true,

      salary: true,

      shiftStart: true,

      shiftEnd: true,

      overtimeEnabled: true,

      overtimeHourlyRate: true,

      overtimeGraceMins: true,

      departmentId: true,

      branchId: true,

      department: {
        select: {
          id: true,

          name: true,

          shiftStart: true,

          shiftEnd: true,
        },
      },

      branch: {
        select: {
          id: true,

          name: true,

          latitude: true,

          longitude: true,
        },
      },
    },

    skip,

    take: limit,

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const countStaffByOrganization = async (
  organizationId: number,
  search: string
) => {
  return prisma.user.count({
    where: {
      organizationId,

      role: "staff",

      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            email: {
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
        ],
      }),
    },
  });
};
