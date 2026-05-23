import AppError from "../utils/AppError";

import {
  countDepartmentByOrganization,
  createDepartment,
} from "../Repository/department.repository";
import { findDepartmentByOrganizationId } from "../Repository/department.repository";
import {
  deleteDepartmentById,
  findDepartmentById,
  updateDepartmentById,
} from "../Repository/department.repository";

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

export const fetchDepartment = async (
  organizationId: number,
  page: number,
  limit: number,
  search: string
) => {
  const skip = (page - 1) * limit;

  const departments = await findDepartmentByOrganizationId(
    organizationId,
    skip,
    limit,
    search
  );

  const totalDepartments = await countDepartmentByOrganization(
    organizationId,
    search
  );

  return {
    departments,

    pagination: {
      total: totalDepartments,

      page,

      limit,

      totalPages: Math.ceil(totalDepartments / limit),
    },
  };
};

export const getDepartmentByIdService = async (
  organizationId: number,
  departmentId: number
) => {
  const department = await findDepartmentById(organizationId, departmentId);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  return department;
};

export const deleteDepartmentService = async (
  organizationId: number,
  departmentId: number
) => {
  const department = await findDepartmentById(organizationId, departmentId);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  // prevent deleting if staff exists
  if (department.users.length > 0) {
    throw new AppError("Cannot delete department with assigned staff", 400);
  }

  await deleteDepartmentById(organizationId, departmentId);

  return {
    message: "Department deleted successfully",
  };
};

export const updateDepartmentService = async (
  organizationId: number,
  departmentId: number,
  data: any
) => {
  const department = await findDepartmentById(organizationId, departmentId);

  if (!department) {
    throw new AppError("Department not found", 404);
  }

  await updateDepartmentById(organizationId, departmentId, data);

  return {
    message: "Department updated successfully",
  };
};
