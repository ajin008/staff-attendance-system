// services/department.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import {
  CreateDepartmentPayload,
  Department,
  GetAllDepartmentsResponse,
} from "../types";

interface CreateDepartmentResponse {
  message: string;
  department: Department;
}

export const createDepartment = async (
  payload: CreateDepartmentPayload
): Promise<CreateDepartmentResponse> => {
  console.log("create department payload:", payload);
  const res = await api.post<CreateDepartmentResponse>(
    ENDPOINT.CREATE_DEPARTMENT,
    payload
  );
  return res.data;
};

// For dropdowns - returns simple array
export const getAllDepartments = async () => {
  const res = await api.get(ENDPOINT.GET_ALL_DEPARTMENTS);
  // console.log("Raw API response:", res.data);

  if (res.data && res.data.department && Array.isArray(res.data.department)) {
    return res.data.department;
  }

  if (Array.isArray(res.data)) {
    return res.data;
  }

  if (res.data && res.data.departments && Array.isArray(res.data.departments)) {
    return res.data.departments;
  }

  // console.warn("Unexpected response structure:", res.data);
  return [];
};

// For paginated table with frontend search support
export const getAllDepartmentsPaginated = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<GetAllDepartmentsResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());

  // Only add search param if backend supports it
  // If backend doesn't support search, we'll handle it on frontend
  if (search && search.trim()) {
    // Uncomment if backend supports search
    // params.append("search", search.trim());
  }

  const res = await api.get(
    `${ENDPOINT.GET_ALL_DEPARTMENTS}?${params.toString()}`
  );
  // console.log("response from all departments:", res.data);

  let departments = res.data.department || res.data.departments || [];

  // Frontend search filtering (if backend doesn't support search)
  if (search && search.trim()) {
    const searchLower = search.toLowerCase().trim();
    departments = departments.filter((dept: Department) =>
      dept.name.toLowerCase().includes(searchLower)
    );
  }

  // Calculate pagination based on filtered results
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDepartments = departments.slice(startIndex, endIndex);

  return {
    departments: paginatedDepartments,
    pagination: {
      total: departments.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(departments.length / limit),
    },
  };
};

export const deleteDepartment = async (
  departmentId: number
): Promise<{ message: string }> => {
  const res = await api.delete(ENDPOINT.DELETE_DEPARTMENT(departmentId));
  return res.data;
};

export const updateDepartment = async (
  departmentId: number,
  data: Partial<CreateDepartmentPayload>
): Promise<{ message: string }> => {
  const res = await api.patch(ENDPOINT.UPDATE_DEPARTMENT(departmentId), data);
  return res.data;
};

export const getDepartmentById = async (
  departmentId: number
): Promise<Department> => {
  const res = await api.get(ENDPOINT.GET_DEPARTMENT_BY_ID(departmentId));
  return res.data;
};
