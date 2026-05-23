import AppError from "../utils/AppError";

import { createDepartment } from "../Repository/department.repository";

interface CreateDepartmentPayload {
  name: string;

  shiftStart: string;

  shiftEnd: string;

  overtimeEnabled: boolean;

  overtimeGraceMins: number;

  overtimeHourlyRate?: number;

  defaultSalary: number;
}

export const createDepartmentService = async (
  payload: CreateDepartmentPayload,

  organizationId: number
) => {
  const {
    name,

    shiftStart,

    shiftEnd,

    overtimeEnabled,

    overtimeGraceMins,

    overtimeHourlyRate,

    defaultSalary,
  } = payload;

  if (!name || !shiftStart || !shiftEnd) {
    throw new AppError("All required fields missing", 400);
  }

  const department = await createDepartment({
    organizationId,

    name,

    shiftStart,

    shiftEnd,

    overtimeEnabled,

    overtimeGraceMins,

    overtimeHourlyRate,

    defaultSalary,
  });

  return department;
};
