import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createDepartmentService } from "../Service/department.service";
import { fetchDepartment } from "../Service/department.service";
import {
  deleteDepartmentService,
  getDepartmentByIdService,
  updateDepartmentService,
  toggleDepartmentStatusService,
} from "../Service/department.service";

export const createDepartment = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("create department triggering - user:", req.user);
    console.log("create department triggering - body:", req.body);
    const organizationId = req.user!.organizationId;

    const department = await createDepartmentService(req.body, organizationId);

    res.status(201).json({
      message: "Department created successfully",

      department,
    });
  }
);

export const fetchDepartmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = (req.query.search as string) || "";

    const result = await fetchDepartment(organizationId, page, limit, search);
    console.log(result.departments[0]);

    res.status(200).json(result);
  }
);

export const getDepartmentByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const departmentId = Number(req.params.departmentId);

    const result = await getDepartmentByIdService(organizationId, departmentId);

    res.status(200).json(result);
  }
);

export const deleteDepartmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const departmentId = Number(req.params.departmentId);

    const result = await deleteDepartmentService(organizationId, departmentId);

    res.status(200).json(result);
  }
);

export const updateDepartmentController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const departmentId = Number(req.params.departmentId);

    const result = await updateDepartmentService(
      organizationId,
      departmentId,
      req.body
    );

    res.status(200).json(result);
  }
);

export const toggleDepartmentStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("toggleDepartmentStatusController triggering");

    const organizationId = req.user!.organizationId;

    const departmentId = Number(req.params.departmentId);

    const { isActive } = req.body;

    const result = await toggleDepartmentStatusService({
      organizationId,

      departmentId,

      isActive,
    });

    res.status(200).json({
      message: "Department status updated successfully",

      data: result,
    });
  }
);
