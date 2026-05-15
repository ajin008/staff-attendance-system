import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";

import {
  checkInService,
  checkOutService,
  getAttendanceHistoryService,
  getTodayAllAttendanceService,
  getTodayAttendanceService,
  getTodaySummaryService,
} from "../Service/attendance.service";

export const checkIn = asyncHandler(async (req: Request, res: Response) => {
  console.log("check-in is triggering");
  const userId = req.user!.userId;

  const attendance = await checkInService(userId);
  console.log("attendance from check in", attendance);

  res.status(200).json({
    message: "Checked in successfully",
    attendance,
  });
});

export const checkOut = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const attendance = await checkOutService(userId);

  res.status(200).json({
    message: "Checked out successfully",
    attendance,
  });
});

export const getTodayAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const attendance = await getTodayAttendanceService(userId);

    res.status(200).json({
      attendance,
    });
  }
);

export const getAttendanceHistory = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const attendance = await getAttendanceHistoryService(userId);

    res.status(200).json({
      attendance,
    });
  }
);

export const getTodaySummary = asyncHandler(
  async (req: Request, res: Response) => {
    const date =
      (req.query.date as string) || new Date().toISOString().split("T")[0];
    const summary = await getTodaySummaryService(date);
    res.status(200).json(summary);
  }
);

export const getTodayAllAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const date =
      (req.query.date as string) || new Date().toISOString().split("T")[0];
    console.log("date received in controller", date);
    const records = await getTodayAllAttendanceService(date);
    console.log("today records:", records);
    res.status(200).json(records);
  }
);
