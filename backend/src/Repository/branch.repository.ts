import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

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
