import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler.js";
import { getProfileDetailsService } from "../Service/profile.service.js";
import { updateProfileDetailsService } from "../Service/profile.service.js";

export const getProfileDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getProfileDetailsController triggering");

    const organizationId = req.user!.organizationId;

    const userId = req.user!.userId;

    const result = await getProfileDetailsService({
      organizationId,

      userId,
    });

    res.status(200).json(result);
  }
);

export const updateProfileDetailsController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("updateProfileDetailsController triggering");

    const organizationId = req.user!.organizationId;

    const userId = req.user!.userId;

    const result = await updateProfileDetailsService({
      organizationId,

      userId,

      payload: req.body,
    });

    res.status(200).json({
      message: "Profile updated successfully",

      result,
    });
  }
);
