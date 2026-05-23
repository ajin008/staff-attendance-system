import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response } from "express";
import { adminStatusService } from "../Service/admin.service";
import { getAllStaffService } from "../Service/staff.service";

export const getStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getStatusController triggering");

    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const result = await adminStatusService(userId, organizationId);
    console.log("status: result:", result);

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

    const result = await getAllStaffService(
      organizationId,
      page,
      limit,
      search
    );

    res.status(200).json(result);
  }
);

import {
  deleteStaffService,
  getStaffByIdService,
  updateStaffService,
} from "../Service/staff.service";

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
