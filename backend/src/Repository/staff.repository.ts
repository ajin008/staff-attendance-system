import prisma from "../utils/prisma";

export const findStaffByStaffId = async (
  organizationId: number,
  staffId: string
) => {
  return prisma.user.findFirst({
    where: {
      organizationId,

      role: "staff",

      staffId,
    },

    include: {
      department: true,
    },
  });
};

export const deleteStaffByStaffId = async (
  organizationId: number,
  staffId: string
) => {
  return prisma.user.deleteMany({
    where: {
      organizationId,

      role: "staff",

      staffId,
    },
  });
};

export const updateStaffByStaffId = async (
  organizationId: number,
  staffId: string,
  data: any
) => {
  return prisma.user.updateMany({
    where: {
      organizationId,

      role: "staff",

      staffId,
    },

    data,
  });
};
