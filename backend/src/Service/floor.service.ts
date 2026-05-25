// Service/floor.service.ts

import AppError from "../utils/AppError";

import { findBranchById } from "../Repository/branch.repository";
import { findAllFloorsByOrganization } from "../Repository/floor.repository";

import {
  createFloorRepository,
  findFloorByNameAndBranch,
} from "../Repository/floor.repository";

import {
  findFloorById,
  updateFloorRepository,
  softDeleteFloorRepository,
} from "../Repository/floor.repository";
import { findAvailableStaffByBranch } from "../Repository/staff.repository";

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
