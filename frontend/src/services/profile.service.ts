// src/services/profile.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface Branch {
  id?: number;
  name: string;
  latitude: number;
  longitude: number;
  allowedRadius?: number;
}

export interface ProfileDetailsResponse {
  organization: {
    id: number;
    companyName: string;
    sector: string;
    branches: Branch[];
  };
  admin: {
    fullName: string;
    phone: string;
    email: string;
  };
}

export interface UpdateProfileInput {
  companyName: string;
  sector: string;
  branches: Branch[];
  fullName: string;
  phone: string;
  password?: string;
}

export interface AddBranchPayload {
  name: string;
  latitude: number;
  longitude: number;
  allowedRadius: number;
}

export const getProfileDetails = async (): Promise<ProfileDetailsResponse> => {
  const res = await api.get(ENDPOINT.GET_PROFILE);
  return res.data;
};

export const updateProfileDetails = async (
  data: UpdateProfileInput
): Promise<{ message: string }> => {
  const res = await api.put(ENDPOINT.UPDATE_PROFILE, data);
  return res.data;
};

export const addBranch = async (
  payload: AddBranchPayload
): Promise<{ message: string; branch: Branch }> => {
  console.log("addBranch payload:", payload);
  const res = await api.post(ENDPOINT.ADD_BRANCH, payload);
  return res.data;
};

export const deleteBranch = async (
  branchId: number
): Promise<{ message: string }> => {
  console.log("deleteBranch branchId:", branchId);
  const res = await api.delete(ENDPOINT.UPDATE_BRANCH(branchId));
  return res.data;
};
