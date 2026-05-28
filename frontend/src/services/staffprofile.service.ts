// src/services/staffProfile.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface ProfileData {
  id: number;
  staffId: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  joinedOn: string;
  salary: number;
  shiftStart: string;
  shiftEnd: string;
  overtimeEnabled: boolean;
  overtimeHourlyRate: number;
  overtimeGraceMins: number;
  department: {
    id: number;
    name: string;
  };
  branch: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    allowedRadius: number;
  };
}

interface ProfileApiResponse {
  message: string;
  data: ProfileData;
}

/**
 * Retrieves authenticated staff member profile configurations
 */
export const getMyProfile = async (): Promise<ProfileData> => {
  const res = await api.get<ProfileApiResponse>(ENDPOINT.GET_MY_PROFILE);
  console.log("getMyProfile response:", res.data);
  return res.data.data;
};
