import { Prisma } from "@prisma/client";

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
