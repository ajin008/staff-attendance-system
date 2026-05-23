import api from "../lib/axios";

import { ENDPOINT } from "../utils/endPoint";

import { CreateDepartmentPayload, Department } from "../types";

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
