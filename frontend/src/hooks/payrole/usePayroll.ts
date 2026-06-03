/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/payrole/usePayroll.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  getPayrollList,
  getPayrollSummary,
  generatePayslip,
  generateAllPayslips,
  getBulkProgress,
  PayrollRecord,
  PayrollSummary,
  BulkProgressResponse,
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

  // Bulk processing states
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<BulkProgressResponse>({
    total: 0,
    processed: 0,
    status: "idle",
  });
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);

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

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  }, []);

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

  // Fetch payroll summary
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

  // Start polling for progress
  const startPolling = useCallback(() => {
    stopPolling();
    pollingInterval.current = setInterval(async () => {
      try {
        // Pass current filters to get progress for this specific batch
        const progress = await getBulkProgress(
          selectedMonth,
          selectedYear,
          selectedDepartmentId
        );
        setBulkProgress(progress);

        if (progress.status === "completed" || progress.status === "failed") {
          stopPolling();
          setIsBulkProcessing(false);

          if (progress.status === "completed") {
            toast.success(
              `Successfully generated ${progress.processed} payslips`
            );
            // Refresh the payroll list to show updated statuses
            await fetchPayrollList(1);
            // Also refresh summary to update totals
            await fetchPayrollSummary();
          } else {
            toast.error("Bulk processing failed. Please try again.");
          }
        }
      } catch (error) {
        console.error("Error fetching bulk progress:", error);
        stopPolling();
        setIsBulkProcessing(false);
        toast.error("Failed to track bulk processing progress");
      }
    }, 3000);
  }, [
    stopPolling,
    fetchPayrollList,
    fetchPayrollSummary,
    selectedMonth,
    selectedYear,
    selectedDepartmentId,
  ]);

  // Handle single payslip generation
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

      setPayrolls((prev) =>
        prev.map((p, i) =>
          i === staffIndex
            ? { ...p, payslipGenerated: true, pdfUrl: response.url }
            : p
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

  // Handle bulk payslip generation
  const handleGenerateAllPayslips = useCallback(async () => {
    setIsBulkProcessing(true);
    setBulkProgress({ total: 0, processed: 0, status: "processing" });

    try {
      await generateAllPayslips(
        selectedMonth,
        selectedYear,
        selectedDepartmentId
      );
      toast.info("Bulk processing started. This may take a few moments...");
      startPolling();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsBulkProcessing(false);
    }
  }, [selectedMonth, selectedYear, selectedDepartmentId, startPolling]);

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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Fetch data when filters change
  useEffect(() => {
    fetchPayrollData();
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
    isBulkProcessing,
    bulkProgress,
    handlePageChange,
    handleMonthChange,
    handleYearChange,
    handleDepartmentChange,
    handleSearch,
    handleGeneratePayslip,
    handleGenerateAllPayslips,
    refreshPayroll: fetchPayrollData,
  };
}
