// src/hooks/useAttendanceStats.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getTodayAttendanceData,
  TodayAttendanceData,
} from "../services/attendance.service";
import { getErrorMessage } from "../utils/axios";

interface AttendanceStats {
  presentToday: number;
  absentToday: number;
  lateCheckIn: number;
}

export function useAttendanceStats() {
  const [stats, setStats] = useState<AttendanceStats>({
    presentToday: 0,
    absentToday: 0,
    lateCheckIn: 0,
  });
  const [attendanceData, setAttendanceData] =
    useState<TodayAttendanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    console.log(" Fetching attendance stats - TIME:", new Date().toISOString());
    setIsLoading(true);
    setError(null);

    try {
      const response = await getTodayAttendanceData();

      setStats({
        presentToday: response.data.present.count,
        absentToday: response.data.absent.count,
        lateCheckIn: response.data.late.count,
      });

      setAttendanceData(response.data);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg || "Failed to load attendance statistics");
      console.error("Error fetching attendance stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log("🔥 useEffect triggered for attendance stats");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    attendanceData,
    isLoading,
    error,
    refreshStats: fetchStats,
  };
}
