import AppError from "../utils/AppError.js";

import { findBranchesByOrganizationId } from "../Repository/branch.repository.js";
import {
  findBranchByName,
  createBranch,
} from "../Repository/branch.repository.js";

import {
  findBranchBy_Id,
  deleteBranchById,
} from "../Repository/branch.repository.js";

export const getAllBranchesService = async (organizationId: number) => {
  return await findBranchesByOrganizationId(organizationId);
};

export const createBranchService = async ({
  organizationId,
  name,
  latitude,
  longitude,
}: {
  organizationId: number;

  name: string;

  latitude: number;

  longitude: number;
}) => {
  // VALIDATION
  if (!name || latitude === undefined || longitude === undefined) {
    throw new AppError("All fields are required", 400);
  }

  // DUPLICATE CHECK
  const existingBranch = await findBranchByName({
    organizationId,

    name,
  });

  if (existingBranch) {
    throw new AppError("Branch already exists", 400);
  }

  // CREATE
  return createBranch({
    organizationId,

    name,

    latitude,

    longitude,

    allowedRadius: 100,
  });
};

export const deleteBranchService = async ({
  organizationId,
  branchId,
}: {
  organizationId: number;

  branchId: number;
}) => {
  const branch = await findBranchBy_Id(organizationId, branchId);

  if (!branch) {
    throw new AppError("Branch not found", 404);
  }

  await deleteBranchById(organizationId, branchId);
};
