// src/services/payroll.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface PayrollRecord {
  pdfUrl: string | undefined;
  id: number;
  staffId: string;
  name: string;
  department: string;
  presentDays: number;
  absentDays: number;
  overtimeHours: number;
  payslipGenerated?: boolean;
}

export interface PayrollSummary {
  totalSalary: number;
  totalPaid: number;
  totalDeduction?: number; // Calculated field
  netPayable?: number; // Calculated field (same as totalPaid)
}

export interface PayrollListResponse {
  message?: string;
  data: {
    payrolls: PayrollRecord[];
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
  staffId: string;
}

export interface GeneratePayslipResponse {
  url: string;
  message?: string;
}

export interface PayrollSummaryResponse {
  message: string;
  data: {
    totalSalary: number;
    totalPaid: number;
  };
}

// Get payroll summary (separate API call)
export const getPayrollSummary = async (
  month: string,
  year: number,
  departmentId?: number | null
): Promise<PayrollSummary> => {
  const params: Record<string, string | number> = {
    month,
    year,
  };

  if (departmentId && departmentId !== undefined && departmentId !== null) {
    params.department = departmentId;
  } else {
    params.department = "all";
  }

  const response = await api.get<PayrollSummaryResponse>(
    ENDPOINT.GET_PAYROLL_SUMMARY,
    { params }
  );

  // Transform backend response to match frontend expected format
  const { totalSalary, totalPaid } = response.data.data;
  return {
    totalSalary,
    totalPaid,
    totalDeduction: totalSalary - totalPaid, // Calculate deduction
    netPayable: totalPaid, // Net payable is same as total paid
  };
};

// Get payroll list with filters
export const getPayrollList = async (
  page: number = 1,
  limit: number = 10,
  month: string,
  year: number,
  searchTerm: string = "",
  departmentId?: number | null
): Promise<PayrollListResponse> => {
  const params: Record<string, string | number> = {
    page,
    limit,
    month,
    year,
  };

  if (searchTerm) {
    params.search = searchTerm;
  }

  if (departmentId && departmentId !== undefined && departmentId !== null) {
    params.department = departmentId;
  } else {
    params.department = "all";
  }

  const response = await api.get(ENDPOINT.GET_PAYROLL, { params });
  return response.data;
};

// Generate payslip
export const generatePayslip = async (
  payload: GeneratePayslipPayload
): Promise<GeneratePayslipResponse> => {
  const response = await api.post(ENDPOINT.GENERATE_PAYSLIP, payload);
  return response.data;
};

export interface BulkProgressResponse {
  total: number;
  processed: number;
  status: "idle" | "processing" | "completed" | "failed";
}

// Generate all payslips (bulk)
export const generateAllPayslips = async (
  month: string,
  year: number,
  departmentId?: number | null
): Promise<{ message: string }> => {
  const params: Record<string, string | number> = {
    month,
    year,
  };

  if (departmentId && departmentId !== undefined && departmentId !== null) {
    params.departmentId = departmentId;
  }

  const response = await api.post(ENDPOINT.GENERATE_ALL_PAYSLIPS, params);
  console.log("generateAllPayslips response:", response.data);
  return response.data;
};

// Get bulk processing progress
export const getBulkProgress = async (
  month: string,
  year: number,
  departmentId?: number | null
): Promise<BulkProgressResponse> => {
  const params: Record<string, string | number> = {
    month,
    year,
  };

  if (departmentId && departmentId !== undefined && departmentId !== null) {
    params.departmentId = departmentId;
  }

  const response = await api.get(ENDPOINT.BULK_PROGRESS, { params });
  return response.data;
};
