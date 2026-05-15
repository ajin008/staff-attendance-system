import api from "../lib/axios";
import type {
  AuthResponse,
  LoginPayload,
  CreateStaffPayload,
  User,
} from "../types";
import { ENDPOINT } from "../utils/endPoint";

export const loginUser = async (
  payload: LoginPayload
): Promise<AuthResponse> => {
  const res = await api.post<AuthResponse>(ENDPOINT.LOGIN, payload);
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await api.post(ENDPOINT.LOGOUT);
};

export const createStaff = async (
  payload: CreateStaffPayload
): Promise<{ message: string; staffId: string }> => {
  const res = await api.post(ENDPOINT.CREATE_STAFF, payload);
  return res.data;
};

export const getAllStaff = async (page = 1, limit = 20, search = "") => {
  const res = await api.get(
    `${ENDPOINT.GET_ALL_STAFF}?page=${page}&limit=${limit}&search=${search}`
  );
  return res.data;
};

export const deleteStaff = async (staffId: string): Promise<void> => {
  await api.delete(ENDPOINT.DELETE_STAFF(staffId));
};

export const updateStaff = async (
  staffId: string,
  data: Partial<{
    name: string;
    email: string;
    password: string;
    phone: string;
  }>
) => {
  console.log("update staff data", data);
  const res = await api.patch(ENDPOINT.UPDATE_STAFF(staffId), data);
  return res.data;
};
