// services/dashboard.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface DashboardStats {
  totalStaff: number;
  departmentCount: number;
  pendingLeaveRequests: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const res = await api.get(ENDPOINT.DASHBOARD_STATS);
  console.log("status result:", res);

  // Check if data is in res.data.result
  const data = res.data.result || res.data;

  // console.log("Processed data from getDashboardStats:", data);

  // Map backend property names to frontend expectations
  return {
    totalStaff: data.totalStaff || 0,
    departmentCount: data.totalDepartments || 0, // Map totalDepartments to departmentCount
    pendingLeaveRequests: data.pendingLeave || 0, // Map pendingLeave to pendingLeaveRequests
  };
};
