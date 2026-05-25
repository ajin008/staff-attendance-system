// src/hooks/useTodayAttendance.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTodayAttendanceData,
  TodayAttendanceData,
} from "../services/attendance.service";
import { getErrorMessage } from "../utils/axios";

export function useTodayAttendance() {
  const [data, setData] = useState<TodayAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getTodayAttendanceData();
      setData(response.data);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      console.error("Error fetching today's attendance:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refreshData: fetchData,
  };
}
