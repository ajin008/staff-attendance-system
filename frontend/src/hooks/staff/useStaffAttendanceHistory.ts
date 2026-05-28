/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/staff/useStaffAttendanceHistory.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMyAttendance,
  AttendanceRecord,
} from "../../services/attendance.service";
import { getErrorMessage } from "../../utils/axios";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";

export function useStaffAttendanceHistory() {
  const { user } = useAuth(); // Get logged-in user from auth context
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [summary, setSummary] = useState({
    totalDays: 0,
    presentDays: 0,
    absentDays: 0,
    lateDays: 0,
    totalWorkHours: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Date range state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const fetchAttendance = useCallback(
    async (page: number = pagination.page) => {
      if (!user?.staffId) return;

      setIsLoading(true);
      setError(null);

      try {
        const params: {
          page: number;
          limit: number;
          startDate?: string;
          endDate?: string;
        } = {
          page,
          limit: pagination.limit,
        };

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        // Use the same getMyAttendance API
        const response = await getMyAttendance(params);

        setAttendance(response.data.attendance);
        if (response.data.summary) {
          setSummary(response.data.summary);
        }
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
    [user?.staffId, startDate, endDate, pagination.limit]
  );

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const resetFilters = () => {
    setStartDate("");
    setEndDate("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    fetchAttendance(pagination.page);
  }, [fetchAttendance, pagination.page]);

  return {
    attendance,
    summary,
    isLoading,
    error,
    pagination,
    startDate,
    endDate,
    handleDateRangeChange,
    handlePageChange,
    resetFilters,
    refreshAttendance: () => fetchAttendance(pagination.page),
  };
}
