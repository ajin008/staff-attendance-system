// src/services/branch.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface Branch {
  id: number;
  organizationId: number;
  name: string;
  latitude: number;
  longitude: number;
  allowedRadius: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllBranchesResponse {
  message: string;
  branches: Branch[];
}

export const getAllBranches = async (): Promise<Branch[]> => {
  const response = await api.get<GetAllBranchesResponse>(
    ENDPOINT.GET_ALL_BRANCHES
  );
  return response.data.branches;
};
