import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import { getAllBranchesService } from "../Service/branch.service";

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
