import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response } from "express";
import {
  checkInStaffService,
  checkOutStaffService,
  getTodayAttendanceService,
} from "../Service/staff.service";

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

export const checkOutStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("create check-out staff triggering");

    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const { latitude, longitude } = req.body;

    console.log("check out data:", latitude, longitude);

    const result = await checkOutStaffService({
      userId,
      organizationId,
      latitude,
      longitude,
    });

    console.log("checkOutStaffController result:", result);

    res.status(200).json(result);
  }
);

export const getTodayAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getTodayAttendanceController  is triggering");
    const userId = req.user!.userId;

    const result = await getTodayAttendanceService(userId);

    res.status(200).json(result);
  }
);
