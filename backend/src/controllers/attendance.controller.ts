// controllers/attendance.controller.ts

import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  getLateAttendanceService,
  getMyAttendanceService,
  getStaffAttendanceService,
} from "../Service/attendance.service";

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

export const getMyAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getMyAttendanceController triggering");

    const userId = req.user!.userId;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const startDate = req.query.startDate as string;

    const endDate = req.query.endDate as string;

    const result = await getMyAttendanceService({
      userId,

      page,

      limit,

      startDate,

      endDate,
    });

    res.status(200).json({
      message: "Attendance history fetched successfully",

      data: result,
    });
  }
);

export const getLateAttendanceController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const result = await getLateAttendanceService(organizationId);

    res.status(200).json(result);
  }
);
