import { asyncHandler } from "../middleware/asyncHandler.js";
import { Request, Response } from "express";
import { adminStatusService, getTodayAttendanceDataService, getAttendanceDataByDateService } from "../Service/admin.service.js";
import { getAllStaffService } from "../Service/staff.service.js";

export const getStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getStatusController triggering");

    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const result = await adminStatusService(userId, organizationId);
    // console.log("status: result:", result);

    res.status(200).json({
      message: "Dashboard status fetched successfully",

      result,
    });
  }
);

export const getAllStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = (req.query.search as string) || "";

    const isActive =
      req.query.isActive !== undefined
        ? req.query.isActive === "true"
        : undefined;

    const result = await getAllStaffService(
      organizationId,
      page,
      limit,
      search,
      isActive
    );

    res.status(200).json(result);
  }
);

import {
  deleteStaffService,
  getStaffByIdService,
  updateStaffService,
} from "../Service/staff.service.js";

export const getStaffByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const staffId = String(req.params.staffId);

    const result = await getStaffByIdService(organizationId, staffId);

    res.status(200).json(result);
  }
);

export const deleteStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const staffId = String(req.params.staffId);

    const result = await deleteStaffService(organizationId, staffId);

    res.status(200).json(result);
  }
);

export const updateStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const staffId = String(req.params.staffId);

    const result = await updateStaffService(organizationId, staffId, req.body);

    res.status(200).json(result);
  }
);

export const getTodayAttendanceDataController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const result = await getTodayAttendanceDataService(organizationId);

    res.status(200).json({
      message: "Today's attendance fetched successfully",

      data: result,
    });
  }
);

export const getAttendanceDataByDateController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;
    const dateStr = req.query.date as string; // YYYY-MM-DD
    const branchIdStr = req.query.branchId as string;
    const departmentIdStr = req.query.departmentId as string;

    if (!dateStr) {
      res.status(400).json({ message: "Date parameter is required" });
      return;
    }

    const branchId = branchIdStr && branchIdStr !== "all" ? parseInt(branchIdStr, 10) : undefined;
    const departmentId = departmentIdStr && departmentIdStr !== "all" ? parseInt(departmentIdStr, 10) : undefined;

    const result = await getAttendanceDataByDateService(
      organizationId,
      dateStr,
      branchId,
      departmentId
    );

    res.status(200).json({
      message: "Attendance data for date fetched successfully",
      data: result,
    });
  }
);

