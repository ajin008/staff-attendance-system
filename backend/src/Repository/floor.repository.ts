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
