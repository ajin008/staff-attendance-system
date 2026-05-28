import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const createOrganization = async (
  tx: Prisma.TransactionClient,
  data: {
    companyName: string;
    industry: string;
  }
) => {
  return tx.organization.create({
    data,
  });
};

export const findOrganizationById = async (organizationId: number) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },

    select: {
      id: true,

      companyName: true,

      industry: true,
    },
  });
};

export const updateOrganizationProfile = async (
  organizationId: number,
  data: {
    companyName: string;

    industry: string;
  }
) => {
  return prisma.organization.update({
    where: {
      id: organizationId,
    },

    data,
  });
};
