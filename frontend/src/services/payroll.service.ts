// src/services/payroll.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface PayrollRecord {
  id: number;
  staffId: string;
  name: string;
  email: string;
  department: string;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  overtimeAmount: number;
  baseSalary: number;
  deduction: number;
  bonus: number;
  netSalary: number;
  status: "pending" | "processed" | "paid";
}

export interface PayrollResponse {
  message: string;
  data: {
    payrolls: PayrollRecord[];
    summary: {
      totalSalary: number;
      totalDeduction: number;
      netPayable: number;
    };
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface GeneratePayslipPayload {
  month: string;
  year: number;
  staffId?: string;
}

export const getPayrollList = async (
  page: number = 1,
  limit: number = 10,
  month?: string,
  year?: number,
  search?: string
): Promise<PayrollResponse> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (month) params.append("month", month);
  if (year) params.append("year", year.toString());
  if (search) params.append("search", search);

  const response = await api.get(
    `${ENDPOINT.GET_PAYROLL}?${params.toString()}`
  );
  return response.data;
};

export const generatePayslip = async (
  payload: GeneratePayslipPayload
): Promise<{ message: string; url: string }> => {
  const response = await api.post(ENDPOINT.GENERATE_PAYSLIP, payload);
  console.log("generatePayslip response:", response.data);
  return response.data;
};
