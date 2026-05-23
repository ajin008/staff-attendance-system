import prisma from "../utils/prisma";

export const countStaffByOrganization = async (organizationId: number) => {
  return prisma.user.count({
    where: {
      organizationId,

      role: "staff",
    },
  });
};

export const countDepartmentByOrganization = async (organizationId: number) => {
  return prisma.department.count({
    where: {
      organizationId,
    },
  });
};
