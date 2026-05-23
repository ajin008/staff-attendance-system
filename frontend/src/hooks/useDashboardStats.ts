// hooks/useDashboardStats.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getDashboardStats,
  DashboardStats,
} from "@/src/services/dashboard.service";
import { getErrorMessage } from "../utils/axios";
import { onDashboardRefresh } from "@/src/utils/events";

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    departmentCount: 0,
    pendingLeaveRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchStats = useCallback(async () => {
    console.log("📊 Fetching dashboard stats...");
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDashboardStats();
      console.log("Data from service:", data);

      setStats({
        totalStaff: data.totalStaff || 0,
        departmentCount: data.departmentCount || 0,
        pendingLeaveRequests: data.pendingLeaveRequests || 0,
      });
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error("Failed to load dashboard statistics");
      console.error("Error fetching dashboard stats:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function to manually refresh stats
  const refreshStats = useCallback(() => {
    console.log("🔄 Manual refresh triggered");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Listen for global dashboard refresh events
  useEffect(() => {
    console.log("🎧 Setting up global refresh event listener");
    const cleanup = onDashboardRefresh(() => {
      console.log("📢 Global refresh event received!");
      setRefreshTrigger((prev) => prev + 1);
    });
    return cleanup;
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
  }, [fetchStats, refreshTrigger]);

  return {
    stats,
    isLoading,
    error,
    refreshStats,
  };
}
