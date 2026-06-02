/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/payrole/usePayroll.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPayrollList,
  getPayrollSummary,
  generatePayslip,
  PayrollRecord,
  PayrollSummary,
} from "../../services/payroll.service";
import { getErrorMessage } from "../../utils/axios";
import { toast } from "sonner";
import { getAllDepartments } from "../../services/department.service";
import type { Department } from "../../types";

export function usePayroll() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState<PayrollSummary>({
    totalSalary: 0,
    totalPaid: 0,
    totalDeduction: 0,
    netPayable: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toLocaleString("default", { month: "long" })
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(true);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = [2024, 2025, 2026, 2027];

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    setIsLoadingDepartments(true);
    try {
      const data = await getAllDepartments();
      setDepartments(data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    } finally {
      setIsLoadingDepartments(false);
    }
  }, []);

  // Fetch payroll summary (separate call)
  const fetchPayrollSummary = useCallback(async () => {
    setIsSummaryLoading(true);
    try {
      const data = await getPayrollSummary(
        selectedMonth,
        selectedYear,
        selectedDepartmentId
      );
      setSummary(data);
    } catch (err) {
      console.error("Error fetching payroll summary:", err);
    } finally {
      setIsSummaryLoading(false);
    }
  }, [selectedMonth, selectedYear, selectedDepartmentId]);

  // Fetch payroll list
  const fetchPayrollList = useCallback(
    async (page: number = pagination.page) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPayrollList(
          page,
          pagination.limit,
          selectedMonth,
          selectedYear,
          searchTerm,
          selectedDepartmentId
        );

        setPayrolls(response.data.payrolls);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          total: response.data.pagination.total,
          totalPages: response.data.pagination.totalPages,
        });
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsLoading(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedMonth,
      selectedYear,
      searchTerm,
      selectedDepartmentId,
      pagination.limit,
    ]
  );

  // Fetch both summary and list
  const fetchPayrollData = useCallback(async () => {
    await Promise.all([fetchPayrollSummary(), fetchPayrollList(1)]);
  }, [fetchPayrollSummary, fetchPayrollList]);

  const handleGeneratePayslip = async (
    staffId: string,
    staffName: string,
    staffIndex: number
  ) => {
    setGeneratingId(staffIndex);
    try {
      const response = await generatePayslip({
        month: selectedMonth,
        year: selectedYear,
        staffId: staffId,
      });
      toast.success(`Payslip generated for ${staffName}`);

      // Update local state to reflect that payslip is now generated
      setPayrolls((prev) =>
        prev.map((p, i) =>
          i === staffIndex ? { ...p, payslipGenerated: true } : p
        )
      );

      if (response.url) {
        window.open(response.url, "_blank");
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setGeneratingId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
    fetchPayrollList(newPage);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDepartmentChange = (departmentId: number | null) => {
    setSelectedDepartmentId(departmentId);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Fetch data when filters change
  useEffect(() => {
    fetchPayrollData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear, selectedDepartmentId, searchTerm]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    payrolls,
    summary,
    isLoading,
    isSummaryLoading,
    error,
    pagination,
    selectedMonth,
    selectedYear,
    selectedDepartmentId,
    searchTerm,
    generatingId,
    months,
    years,
    departments,
    isLoadingDepartments,
    handlePageChange,
    handleMonthChange,
    handleYearChange,
    handleDepartmentChange,
    handleSearch,
    handleGeneratePayslip,
    refreshPayroll: fetchPayrollData,
  };
}
