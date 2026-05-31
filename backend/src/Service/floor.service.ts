// Service/floor.service.ts

import AppError from "../utils/AppError.js";

import { findBranchById } from "../Repository/branch.repository.js";
import {
  findAllFloorsByOrganization,
  findFloorStaff,
} from "../Repository/floor.repository.js";

import {
  createFloorRepository,
  findFloorByNameAndBranch,
} from "../Repository/floor.repository.js";

import {
  findFloorById,
  updateFloorRepository,
  softDeleteFloorRepository,
} from "../Repository/floor.repository.js";
import {
  createStaffAllocation,
  findActiveAllocationByUserId,
  findAvailableStaffByBranch,
} from "../Repository/staff.repository.js";
import { findUserById } from "../Repository/user.repository.js";

import {
  findActiveAllocationByFloorAndUser,
  deactivateStaffAllocation,
} from "./../Repository/staff.repository.js";

import { findActiveStaffAllocation } from "../Repository/floor.repository.js";

interface UpdateFloorInput {
  organizationId: number;

  floorId: number;

  name: string;

  maxCapacity: number;

  branchId: number;
}

interface CreateFloorInput {
  organizationId: number;

  name: string;

  maxCapacity: number;

  branchId: number;
}

export const createFloorService = async ({
  organizationId,
  name,
  maxCapacity,
  branchId,
}: CreateFloorInput) => {
  // VALIDATE BRANCH
  const branch = await findBranchById(branchId);

  if (!branch) {
    throw new AppError("Branch not found", 404);
  }

  // SECURITY VALIDATION
  if (branch.organizationId !== organizationId) {
    throw new AppError("Unauthorized branch access", 403);
  }

  // PREVENT DUPLICATE FLOOR
  const existingFloor = await findFloorByNameAndBranch(name, branchId);

  if (existingFloor) {
    throw new AppError("Floor already exists in this branch", 400);
  }

  const floor = await createFloorRepository({
    organizationId,

    branchId,

    name,

    maxCapacity,
  });

  return floor;
};

export const getAllFloorsService = async (organizationId: number) => {
  return await findAllFloorsByOrganization(organizationId);
};

export const updateFloorService = async ({
  organizationId,
  floorId,
  name,
  maxCapacity,
  branchId,
}: UpdateFloorInput) => {
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  const branch = await findBranchById(branchId);

  if (!branch) {
    throw new AppError("Branch not found", 404);
  }

  const updatedFloor = await updateFloorRepository(floorId, {
    name,
    maxCapacity,
    branchId,
  });

  return updatedFloor;
};

export const deleteFloorService = async (
  organizationId: number,
  floorId: number
) => {
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  await softDeleteFloorRepository(floorId);
};

export const getAvailableStaffService = async (
  organizationId: number,
  floorId: number
) => {
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  const staff = await findAvailableStaffByBranch(
    organizationId,
    floor.branchId
  );

  return staff;
};

export const assignStaffToFloorService = async ({
  organizationId,
  assignedBy,
  floorId,
  userId,
}: {
  organizationId: number;

  assignedBy: number;

  floorId: number;

  userId: number;
}) => {
  // FIND FLOOR
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  // SECURITY CHECK
  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  // FIND STAFF
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("Staff not found", 404);
  }

  // MUST BELONG TO SAME BRANCH
  if (user.branchId !== floor.branchId) {
    throw new AppError("Staff and floor must belong to same branch", 400);
  }

  // CHECK ACTIVE ALLOCATION
  const existingAllocation = await findActiveAllocationByUserId(userId);

  if (existingAllocation) {
    throw new AppError("Staff already assigned to another floor", 400);
  }

  // CHECK FLOOR CAPACITY
  const activeStaffCount = floor.staffAllocations.filter(
    (allocation) => allocation.isActive
  ).length;

  if (activeStaffCount >= floor.maxCapacity) {
    throw new AppError("Floor capacity reached", 400);
  }

  // CREATE ALLOCATION
  await createStaffAllocation({
    userId,

    organizationId,

    branchId: floor.branchId,

    floorId,

    assignedBy,
  });

  return {
    message: "Staff assigned successfully",
  };
};

export const getFloorStaffService = async (
  organizationId: number,
  floorId: number
) => {
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  const staff = await findFloorStaff(floorId);

  return staff;
};

export const removeStaffFromFloorService = async ({
  organizationId,
  floorId,
  userId,
}: {
  organizationId: number;

  floorId: number;

  userId: number;
}) => {
  // FIND FLOOR
  const floor = await findFloorById(floorId);

  if (!floor) {
    throw new AppError("Floor not found", 404);
  }

  // SECURITY CHECK
  if (floor.organizationId !== organizationId) {
    throw new AppError("Unauthorized access", 403);
  }

  // FIND ACTIVE ALLOCATION
  const allocation = await findActiveAllocationByFloorAndUser(floorId, userId);

  if (!allocation) {
    throw new AppError("Staff is not assigned to this floor", 404);
  }

  // DEACTIVATE ALLOCATION
  await deactivateStaffAllocation(allocation.id);

  return {
    message: "Staff removed from floor successfully",
  };
};

export const getMyFloorAllocationService = async ({
  userId,
  organizationId,
}: {
  userId: number;

  organizationId: number;
}) => {
  const allocation = await findActiveStaffAllocation({
    userId,
    organizationId,
  });

  // NOT ASSIGNED
  if (!allocation) {
    return {
      assigned: false,

      allocation: null,
    };
  }

  return {
    assigned: true,

    allocation: {
      id: allocation.id,

      assignedAt: allocation.assignedAt,

      branch: {
        id: allocation.branch.id,

        name: allocation.branch.name,
      },

      floor: {
        id: allocation.floor.id,

        name: allocation.floor.name,

        code: allocation.floor.code,

        maxCapacity: allocation.floor.maxCapacity,
      },
    },
  };
};
