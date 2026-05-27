/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/usePayroll.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getPayrollList,
  generatePayslip,
  PayrollRecord,
} from "../../services/payroll.service";
import { getErrorMessage } from "../../utils/axios";
import { toast } from "sonner";

export function usePayroll() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [summary, setSummary] = useState({
    totalSalary: 0,
    totalDeduction: 0,
    netPayable: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
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
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingId, setGeneratingId] = useState<number | null>(null);

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

  const fetchPayroll = useCallback(
    async (page: number = pagination.page) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getPayrollList(
          page,
          pagination.limit,
          selectedMonth,
          selectedYear,
          searchTerm
        );
        setPayrolls(response.data.payrolls);
        setSummary(response.data.summary);
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
    [selectedMonth, selectedYear, searchTerm, pagination.limit]
  );

  const handleGeneratePayslip = async (staffId: string, staffName: string) => {
    setGeneratingId(Number(staffId));
    try {
      const response = await generatePayslip({
        month: selectedMonth,
        year: selectedYear,
        staffId: staffId,
      });
      toast.success(`Payslip generated for ${staffName}`);
      // Open payslip in new tab if URL is returned
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
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchPayroll();
  }, [fetchPayroll]);

  return {
    payrolls,
    summary,
    isLoading,
    error,
    pagination,
    selectedMonth,
    selectedYear,
    searchTerm,
    generatingId,
    months,
    years,
    handlePageChange,
    handleMonthChange,
    handleYearChange,
    handleSearch,
    handleGeneratePayslip,
    refreshPayroll: fetchPayroll,
  };
}
