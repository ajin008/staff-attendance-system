// controllers/attendance.controller.ts

import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import { getStaffAttendanceService } from "../Service/attendance.service";

export const getStaffAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getStaffAttendanceController triggering");

    const organizationId = req.user!.organizationId;
    const staffId = String(req.params.staffId);

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const startDate = req.query.startDate as string;

    const endDate = req.query.endDate as string;

    const result = await getStaffAttendanceService({
      organizationId,

      staffId,

      page,

      limit,

      startDate,

      endDate,
    });

    console.log("getStaffAttendanceController result:", result);

    res.status(200).json({
      message: "Staff attendance fetched successfully",

      data: result,
    });
  }
);
