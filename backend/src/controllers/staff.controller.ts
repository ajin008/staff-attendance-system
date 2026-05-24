import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response } from "express";
import { checkInStaffService } from "../Service/staff.service";

export const checkInStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("create check-in staff triggering");

    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const { latitude, longitude } = req.body;

    const result = await checkInStaffService({
      userId,
      organizationId,
      latitude,
      longitude,
    });

    res.status(200).json(result);
  }
);
