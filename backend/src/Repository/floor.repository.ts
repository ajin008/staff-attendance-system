// Repository/floor.repository.ts

import prisma from "../utils/prisma";

export const createFloorRepository = async ({
  organizationId,
  branchId,
  name,
  maxCapacity,
}: {
  organizationId: number;

  branchId: number;

  name: string;

  maxCapacity: number;
}) => {
  return prisma.floor.create({
    data: {
      organizationId,

      branchId,

      name,

      maxCapacity,
    },
  });
};

export const findFloorByNameAndBranch = async (
  name: string,
  branchId: number
) => {
  return prisma.floor.findFirst({
    where: {
      name,

      branchId,
    },
  });
};

export const findAllFloorsByOrganization = async (organizationId: number) => {
  return prisma.floor.findMany({
    where: {
      organizationId,

      isActive: true,
    },

    include: {
      branch: {
        select: {
          id: true,

          name: true,
        },
      },

      _count: {
        select: {
          staffAllocations: {
            where: {
              isActive: true,
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

export const findFloorById = async (floorId: number) => {
  return prisma.floor.findUnique({
    where: {
      id: floorId,
    },
    include: {
      staffAllocations: true,
    },
  });
};

export const updateFloorRepository = async (
  floorId: number,
  data: {
    name: string;

    maxCapacity: number;

    branchId: number;
  }
) => {
  return prisma.floor.update({
    where: {
      id: floorId,
    },

    data,
  });
};

export const softDeleteFloorRepository = async (floorId: number) => {
  return prisma.floor.update({
    where: {
      id: floorId,
    },

    data: {
      isActive: false,
    },
  });
};

export const findFloorStaff = async (floorId: number) => {
  return prisma.staffAllocation.findMany({
    where: {
      floorId,

      isActive: true,
    },

    include: {
      user: {
        select: {
          id: true,

          staffId: true,

          name: true,

          email: true,

          phone: true,

          attendances: {
            where: {
              checkOutTime: null,
            },

            take: 1,

            orderBy: {
              createdAt: "desc",
            },

            select: {
              checkInTime: true,

              attendanceStatus: true,

              isLate: true,

              lateMinutes: true,
            },
          },
        },
      },
    },

    orderBy: {
      assignedAt: "asc",
    },
  });
};
