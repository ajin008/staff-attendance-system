// src/hooks/admin-leave/useAllLeavesHistory.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { getAllLeaves, Leave } from "../../services/leave.service";
import { getErrorMessage } from "../../utils/axios";
import { toast } from "sonner";

export function useAllLeavesHistory() {
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaves = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllLeaves();
      // Extract all leaves (not just pending)
      const allLeaves = response?.result?.pendingLeaveRequests || [];
      setLeaves(allLeaves);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return {
    leaves,
    isLoading,
    error,
    refreshLeaves: fetchLeaves,
  };
}
