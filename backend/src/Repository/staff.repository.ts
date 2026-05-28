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

export const findAvailableStaffByBranch = async (
  organizationId: number,
  branchId: number
) => {
  // TODAY START
  const startOfDay = new Date();

  startOfDay.setHours(0, 0, 0, 0);

  // TODAY END
  const endOfDay = new Date();

  endOfDay.setHours(23, 59, 59, 999);

  return prisma.user.findMany({
    where: {
      organizationId,

      branchId,

      role: "staff",

      // ONLY STAFF WHO CHECKED IN TODAY
      attendances: {
        some: {
          checkInTime: {
            not: null,
          },

          checkOutTime: null,

          createdAt: {
            gte: startOfDay,

            lte: endOfDay,
          },
        },
      },

      // STAFF NOT ALREADY ALLOCATED
      staffAllocations: {
        none: {
          isActive: true,
        },
      },
    },

    select: {
      id: true,

      staffId: true,

      name: true,

      email: true,

      phone: true,

      branch: {
        select: {
          id: true,

          name: true,
        },
      },

      department: {
        select: {
          id: true,

          name: true,
        },
      },
    },

    orderBy: {
      name: "asc",
    },
  });
};

export const findActiveAllocationByUserId = async (userId: number) => {
  return prisma.staffAllocation.findFirst({
    where: {
      userId,

      isActive: true,
    },
  });
};

export const createStaffAllocation = async (data: {
  userId: number;

  organizationId: number;

  branchId: number;

  floorId: number;

  assignedBy: number;
}) => {
  return prisma.staffAllocation.create({
    data,
  });
};

export const findActiveAllocationByFloorAndUser = async (
  floorId: number,
  userId: number
) => {
  return prisma.staffAllocation.findFirst({
    where: {
      floorId,

      userId,

      isActive: true,
    },
  });
};

export const deactivateStaffAllocation = async (allocationId: number) => {
  return prisma.staffAllocation.update({
    where: {
      id: allocationId,
    },

    data: {
      isActive: false,

      checkedOutAt: new Date(),
    },
  });
};

export const findStaffProfile = async ({
  userId,
  organizationId,
}: {
  userId: number;

  organizationId: number;
}) => {
  return prisma.user.findFirst({
    where: {
      id: userId,

      organizationId,
    },

    include: {
      department: true,

      branch: true,
    },
  });
};
