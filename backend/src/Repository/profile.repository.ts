import prisma from "../utils/prisma";

export const findOrganizationProfile = async (organizationId: number) => {
  return prisma.organization.findUnique({
    where: {
      id: organizationId,
    },

    include: {
      branches: {
        select: {
          id: true,

          name: true,

          latitude: true,

          longitude: true,

          allowedRadius: true,
        },
      },
    },
  });
};

export const findAdminProfile = async (userId: number) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      id: true,

      name: true,

      phone: true,

      email: true,
    },
  });
};
