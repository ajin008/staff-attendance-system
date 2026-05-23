import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma";

export const createUser = async (
  tx: Prisma.TransactionClient,
  data: {
    organizationId: number;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "admin" | "staff";
    joinedOn: Date;
  }
) => {
  return tx.user.create({
    data,
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
  });
};
