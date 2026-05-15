"use client";
import { Mood } from "../types";

import { useCallback, useEffect, useState } from "react";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
} from "../services/attendance.service";
import { AttendanceRecord } from "../types";

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTodayAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getTodayAttendance();
      setAttendance(res);
    } catch {
      setAttendance(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayAttendance();
  }, [fetchTodayAttendance]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    try {
      await checkIn();
      await fetchTodayAttendance();
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async (mood: Mood) => {
    setActionLoading(true);
    try {
      await checkOut(mood);
      await fetchTodayAttendance();
    } catch (err) {
      throw err;
    } finally {
      setActionLoading(false);
    }
  };

  return {
    attendance,
    loading,
    actionLoading,
    handleCheckIn,
    handleCheckOut,
    refresh: fetchTodayAttendance,
  };
};
