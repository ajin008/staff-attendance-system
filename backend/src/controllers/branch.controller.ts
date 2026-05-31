import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler.js";

import {
  createBranchService,
  deleteBranchService,
  getAllBranchesService,
} from "../Service/branch.service.js";

export const getAllBranchesController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const branches = await getAllBranchesService(organizationId);

    res.status(200).json({
      message: "Branches fetched successfully",

      branches,
    });
  }
);

export const createBranchController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("createBranchController triggering");

    const organizationId = req.user!.organizationId;

    const { name, latitude, longitude } = req.body;

    const branch = await createBranchService({
      organizationId,

      name,

      latitude,

      longitude,
    });

    res.status(201).json({
      message: "Branch created successfully",

      branch,
    });
  }
);

export const deleteBranchController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("deleteBranchController triggering");

    const organizationId = req.user!.organizationId;

    const branchId = Number(req.params.branchId);

    await deleteBranchService({
      organizationId,
      branchId,
    });

    res.status(200).json({
      message: "Branch deleted successfully",
    });
  }
);
