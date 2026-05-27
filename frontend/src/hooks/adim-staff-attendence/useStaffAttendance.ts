// src/hooks/useStaffAttendance.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getStaffAttendance,
  AttendanceRecord,
  StaffAttendanceResponse,
} from "../../services/attendance.service";
import { getErrorMessage } from "@/src/utils/axios";
import { toast } from "sonner";

interface UseStaffAttendanceProps {
  staffId: string;
}

export function useStaffAttendance({ staffId }: UseStaffAttendanceProps) {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [staffInfo, setStaffInfo] = useState<
    StaffAttendanceResponse["data"]["staff"] | null
  >(null);
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
      if (!staffId) return;

      setIsLoading(true);
      setError(null);

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = {
          page,
          limit: pagination.limit,
        };

        if (startDate) params.startDate = startDate;
        if (endDate) params.endDate = endDate;

        const response = await getStaffAttendance(staffId, params);

        setAttendance(response.data.attendance);
        setStaffInfo(response.data.staff);
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
    [staffId, startDate, endDate, pagination.limit]
  );

  const handleDateRangeChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAttendance(pagination.page);
  }, [fetchAttendance, pagination.page]);

  return {
    attendance,
    staffInfo,
    isLoading,
    error,
    pagination,
    startDate,
    endDate,
    handleDateRangeChange,
    handlePageChange,
    resetDateFilter,
    refreshAttendance: () => fetchAttendance(pagination.page),
  };
}
