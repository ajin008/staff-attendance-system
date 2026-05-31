import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma.js";

export const createBranches = async (
  tx: Prisma.TransactionClient,
  branches: {
    organizationId: number;
    name: string;
    latitude: number;
    longitude: number;
  }[]
) => {
  return tx.branch.createMany({
    data: branches,
  });
};

export const findBranchesByOrganizationId = async (organizationId: number) => {
  return prisma.branch.findMany({
    where: {
      organizationId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const findBranchById = async (branchId: number) => {
  return prisma.branch.findUnique({
    where: {
      id: branchId,
    },
  });
};

export const updateBranchById = async (
  branchId: number,
  data: {
    name: string;

    latitude: number;

    longitude: number;
  }
) => {
  return prisma.branch.update({
    where: {
      id: branchId,
    },

    data,
  });
};

// export const createBranch = async ({
//   organizationId,
//   name,
//   latitude,
//   longitude,
//   allowedRadius,
// }: {
//   organizationId: number;

//   name: string;

//   latitude: number;

//   longitude: number;

//   allowedRadius: number;
// }) => {
//   return prisma.branch.create({
//     data: {
//       organizationId,

//       name,

//       latitude,

//       longitude,

//       allowedRadius,
//     },
//   });
// };

export const findBranchByName = async ({
  organizationId,
  name,
}: {
  organizationId: number;

  name: string;
}) => {
  return prisma.branch.findFirst({
    where: {
      organizationId,

      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

export const createBranch = async ({
  organizationId,
  name,
  latitude,
  longitude,
  allowedRadius,
}: {
  organizationId: number;

  name: string;

  latitude: number;

  longitude: number;

  allowedRadius: number;
}) => {
  return prisma.branch.create({
    data: {
      organizationId,

      name,

      latitude,

      longitude,

      allowedRadius,
    },
  });
};

export const findBranchBy_Id = async (
  organizationId: number,
  branchId: number
) => {
  return prisma.branch.findFirst({
    where: {
      id: branchId,

      organizationId,
    },
  });
};

export const deleteBranchById = async (
  organizationId: number,
  branchId: number
) => {
  return prisma.branch.deleteMany({
    where: {
      id: branchId,

      organizationId,
    },
  });
};
