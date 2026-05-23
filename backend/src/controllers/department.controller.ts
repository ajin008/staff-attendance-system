import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import { createDepartmentService } from "../Service/department.service";

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
