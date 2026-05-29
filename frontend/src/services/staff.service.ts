// services/staff.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import { CreateStaffInput, User, GetAllStaffResponse } from "../types";

interface CreateStaffResponse {
  message: string;
  staff: User;
}

export const createStaff = async (
  payload: CreateStaffInput
): Promise<CreateStaffResponse> => {
  console.log("create staff payload:", payload);

  const res = await api.post<CreateStaffResponse>(
    ENDPOINT.CREATE_STAFF,
    payload
  );
  // console.log("create staff response:", res.data);
  return res.data;
};

export const getAllStaff = async (
  page = 1,
  limit = 10,
  search = "",
  isActive?: boolean
): Promise<GetAllStaffResponse> => {
  const params = new URLSearchParams();

  params.append("page", page.toString());

  params.append("limit", limit.toString());

  if (search.trim()) {
    params.append("search", search.trim());
  }

  if (isActive !== undefined) {
    params.append("isActive", String(isActive));
  }

  const res = await api.get(`${ENDPOINT.GET_ALL_STAFF}?${params.toString()}`);

  return res.data;
};

// export const deleteStaff = async (staffId: string): Promise<void> => {
//   await api.delete(ENDPOINT.DELETE_STAFF(staffId));
// };

export const updateStaff = async (
  staffId: string,
  data: Partial<CreateStaffInput>
): Promise<User> => {
  const res = await api.patch(ENDPOINT.UPDATE_STAFF(staffId), data);
  return res.data;
};

export const getStaffById = async (staffId: string): Promise<User> => {
  const res = await api.get(ENDPOINT.GET_STAFF_BY_ID(staffId));
  return res.data;
};

export interface StaffAttendance {
  id: number;
  staffId: string;
  name: string;
  email: string;
  checkInTime?: string;
  isLate?: boolean;
  lateMinutes?: number;
  branch?: { id: number; name: string };
}

export const toggleStaffStatus = async (
  staffId: string,
  isActive: boolean
): Promise<void> => {
  await api.patch(ENDPOINT.TOGGLE_STAFF_STATUS(staffId), { isActive });
};

export const getActiveStaff = async (
  page: number,
  limit: number,
  search?: string
): Promise<GetAllStaffResponse> => {
  const response = await api.get(ENDPOINT.GET_ACTIVE_STAFF, {
    params: { page, limit, search, isActive: true },
  });
  return response.data;
};

export const getInactiveStaff = async (
  page: number,
  limit: number,
  search?: string
): Promise<GetAllStaffResponse> => {
  const response = await api.get(ENDPOINT.GET_INACTIVE_STAFF, {
    params: { page, limit, search, isActive: false },
  });
  return response.data;
};
