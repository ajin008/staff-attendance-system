import { Request, Response } from "express";

import { asyncHandler } from "../middleware/asyncHandler.js";
import {
  generatePayslipService,
  getPayrollService,
} from "../Service/payroll.service.js";

export const getPayrollController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const month = req.query.month as string;

    const year = Number(req.query.year) || new Date().getFullYear();

    const search = req.query.search as string;

    const result = await getPayrollService({
      organizationId,
      page,
      limit,
      month,
      year,
      search,
    });

    res.status(200).json({
      message: "Payroll data fetched successfully",

      data: result,
    });
  }
);

export const generatePayslipController = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("generatePayslipController triggering");

    const organizationId = req.user!.organizationId;

    const adminId = req.user!.userId;

    const { month, year, staffId } = req.body;

    const result = await generatePayslipService({
      organizationId,

      adminId,

      month,

      year,

      staffId,
    });

    res.status(200).json({
      message: "Payslip generated successfully",
      url: result.url,
      payroll: result.payroll,
    });
  }
);
