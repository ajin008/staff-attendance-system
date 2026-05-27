// src/services/leave.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import type { CreateLeavePayload, LeaveResponse } from "../types";

export interface Leave {
  id: number;
  leaveType: "sick" | "casual" | "emergency";
  reason: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: "pending" | "approved" | "rejected";
  approvedAt: string | null;
  createdAt: string;
  user?: {
    id: number;
    staffId: string;
    name: string;
    email: string;
    department?: {
      id: number;
      name: string;
    };
  };
}

export interface GetMyLeavesResponse {
  message: string;
  leaves: Leave[];
}

export interface GetAllLeavesResponse {
  message: string;
  result: {
    totalStaff?: number;
    totalDepartments?: number;
    pendingLeave?: number;
    pendingLeaveRequests: Leave[];
  };
}

export interface UpdateLeaveStatusPayload {
  status: "approved" | "rejected";
}

export const createLeaveRequest = async (
  payload: CreateLeavePayload
): Promise<LeaveResponse> => {
  const response = await api.post<LeaveResponse>(
    ENDPOINT.CREATE_LEAVE,
    payload
  );
  return response.data;
};

export const getMyLeaves = async (): Promise<GetMyLeavesResponse> => {
  const response = await api.get<GetMyLeavesResponse>(ENDPOINT.GET_MY_LEAVES);
  return response.data;
};

export const getAllLeaves = async (): Promise<GetAllLeavesResponse> => {
  console.log("Calling getAllLeaves service...");
  const response = await api.get<GetAllLeavesResponse>(ENDPOINT.GET_ALL_LEAVES);
  console.log("response from getAllLeaves service:", response.data);
  return response.data;
};

export const updateLeaveStatus = async (
  leaveId: number,
  payload: UpdateLeaveStatusPayload
): Promise<{ message: string }> => {
  const response = await api.patch(
    ENDPOINT.UPDATE_LEAVE_STATUS(leaveId),
    payload
  );
  return response.data;
};
