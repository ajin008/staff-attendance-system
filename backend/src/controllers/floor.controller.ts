import { asyncHandler } from "../middleware/asyncHandler";
import { Request, Response } from "express";
import {
  assignStaffToFloorService,
  getFloorStaffService,
  removeStaffFromFloorService,
} from "../Service/floor.service";

import {
  createFloorService,
  getAvailableStaffService,
} from "../Service/floor.service";
import { getAllFloorsService } from "../Service/floor.service";

import {
  updateFloorService,
  deleteFloorService,
} from "../Service/floor.service";

export const createFloorController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("create floor controller triggering");
    const organizationId = req.user!.organizationId;

    const { name, maxCapacity, branchId } = req.body;

    const floor = await createFloorService({
      organizationId,

      name,

      maxCapacity,

      branchId,
    });

    res.status(201).json({
      message: "Floor created successfully",

      floor,
    });
  }
);

export const getAllFloorsController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getAllFloorsController triggering");
    const organizationId = req.user!.organizationId;

    const floors = await getAllFloorsService(organizationId);

    res.status(200).json({
      message: "Floors fetched successfully",

      floors,
    });
  }
);

export const updateFloorController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const floorId = Number(req.params.id);

    const { name, maxCapacity, branchId } = req.body;

    const floor = await updateFloorService({
      organizationId,

      floorId,

      name,

      maxCapacity,

      branchId,
    });

    res.status(200).json({
      message: "Floor updated successfully",

      floor,
    });
  }
);

export const deleteFloorController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const floorId = Number(req.params.id);

    await deleteFloorService(organizationId, floorId);

    res.status(200).json({
      message: "Floor deleted successfully",
    });
  }
);

export const getAvailableStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getAvailableStaffController triggering");
    const organizationId = req.user!.organizationId;

    const floorId = Number(req.params.floorId);
    console.log("getAvailableStaffController req.params:", req.params);

    const staff = await getAvailableStaffService(organizationId, floorId);

    res.status(200).json({
      message: "Available staff fetched successfully",

      staff,
    });
  }
);

export const assignStaffToFloorController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("assignStaffToFloorController triggering");

    const organizationId = req.user!.organizationId;

    const assignedBy = req.user!.userId;

    const floorId = Number(req.params.floorId);

    const { staffId } = req.body;

    const result = await assignStaffToFloorService({
      organizationId,
      assignedBy,
      floorId,
      userId: staffId,
    });

    res.status(200).json(result);
  }
);

export const getFloorStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("getFloorStaffController triggering");

    const organizationId = req.user!.organizationId;

    const floorId = Number(req.params.floorId);

    const staff = await getFloorStaffService(organizationId, floorId);

    res.status(200).json({
      message: "Floor staff fetched successfully",

      staff,
    });
  }
);

export const removeStaffFromFloorController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("removeStaffFromFloorController triggering");

    const organizationId = req.user!.organizationId;

    const floorId = Number(req.params.floorId);

    const staffId = Number(req.params.staffId);

    const result = await removeStaffFromFloorService({
      organizationId,
      floorId,
      userId: staffId,
    });

    res.status(200).json(result);
  }
);
