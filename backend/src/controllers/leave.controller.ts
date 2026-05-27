// controllers/leave.controller.ts

import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler";
import { getAllLeavesService } from "../Service/leave.service";

import {
  createLeaveRequestService,
  getMyLeavesService,
} from "../Service/leave.service";

import { updateLeaveStatusService } from "../Service/leave.service";

export const createLeaveRequestController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("createLeaveRequestController triggering");

    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const result = await createLeaveRequestService({
      userId,
      organizationId,
      ...req.body,
    });

    res.status(201).json({
      message: "Leave request created successfully",

      leaveRequest: result,
    });
  }
);

export const getMyLeavesController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getMyLeavesController triggering");

    const userId = req.user!.userId;

    const leaves = await getMyLeavesService(userId);

    res.status(200).json({
      message: "Leave requests fetched successfully",

      leaves,
    });
  }
);

export const updateLeaveStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("updateLeaveStatusController triggering");

    const leaveId = Number(req.params.leaveId);

    const approvedBy = req.user!.userId;

    const { status } = req.body;

    const result = await updateLeaveStatusService({
      leaveId,

      approvedBy,

      status,
    });

    res.status(200).json(result);
  }
);

export const getAllLeavesController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getAllLeavesController triggering");

    const organizationId = req.user!.organizationId;

    const result = await getAllLeavesService(organizationId);

    res.status(200).json({
      message: "All leave requests fetched successfully",

      result,
    });
  }
);
