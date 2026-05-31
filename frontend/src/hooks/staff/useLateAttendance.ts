"use client";

import { getErrorMessage } from "@/src/utils/axios";
// src/hooks/useLateAttendance.ts

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  getLateCheckIns,
  LateStaffMember,
} from "../../services/attendance.service";

export const useLateAttendance = () => {
  const [staffList, setStaffList] = useState<LateStaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const fetchLateStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getLateCheckIns();
      setStaffList(data);
    } catch (err) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchLateStaff();
    }
  }, [fetchLateStaff]);

  const refresh = useCallback(() => {
    hasFetched.current = false;
    fetchLateStaff();
  }, [fetchLateStaff]);

  return {
    staffList,
    isLoading,
    error,
    refresh,
  };
};
