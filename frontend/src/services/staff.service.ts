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

  try {
    const res = await api.post<CreateStaffResponse>(
      ENDPOINT.CREATE_STAFF,
      payload
    );
    console.log("create staff response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating staff:", error);
    throw error;
  }
};

export const getAllStaff = async (
  page = 1,
  limit = 10,
  search = ""
): Promise<GetAllStaffResponse> => {
  try {
    // Build query params
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (search && search.trim()) {
      params.append("search", search.trim());
    }

    const res = await api.get(`${ENDPOINT.GET_ALL_STAFF}?${params.toString()}`);
    console.log("response from get all staff:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching staff:", error);
    throw error;
  }
};

export const deleteStaff = async (staffId: string): Promise<void> => {
  try {
    await api.delete(ENDPOINT.DELETE_STAFF(staffId));
  } catch (error) {
    console.error("Error deleting staff:", error);
    throw error;
  }
};

export const updateStaff = async (
  staffId: string,
  data: Partial<CreateStaffInput>
): Promise<User> => {
  try {
    const res = await api.patch(ENDPOINT.UPDATE_STAFF(staffId), data);
    return res.data;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw error;
  }
};

export const getStaffById = async (staffId: string): Promise<User> => {
  try {
    const res = await api.get(ENDPOINT.GET_STAFF_BY_ID(staffId));
    return res.data;
  } catch (error) {
    console.error("Error fetching staff by id:", error);
    throw error;
  }
};
