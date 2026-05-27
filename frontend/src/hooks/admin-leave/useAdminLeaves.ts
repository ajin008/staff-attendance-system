// src/hooks/admin-leave/useAdminLeaves.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getAllLeaves,
  updateLeaveStatus,
  Leave,
} from "../../services/leave.service";
import { toast } from "sonner";
import { getErrorMessage } from "../../utils/axios";

export function useAdminLeaves() {
  const [allLeaves, setAllLeaves] = useState<Leave[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchLeaves = useCallback(async () => {
    console.log("🔄 Fetching leave requests...");
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAllLeaves();
      console.log("📦 API Response:", response);

      // Extract all leaves from response
      const leaveList = response?.result?.pendingLeaveRequests || [];
      setAllLeaves(leaveList);
    } catch (err) {
      console.error("❌ Error fetching leaves:", err);
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const approveLeave = useCallback(
    async (leaveId: number) => {
      setProcessingId(leaveId);
      try {
        await updateLeaveStatus(leaveId, { status: "approved" });
        toast.success("Leave request approved");
        await fetchLeaves(); // Refresh the list after approval
      } catch (err) {
        console.error("Error approving leave:", err);
        toast.error(getErrorMessage(err));
      } finally {
        setProcessingId(null);
      }
    },
    [fetchLeaves]
  );

  const rejectLeave = useCallback(
    async (leaveId: number) => {
      setProcessingId(leaveId);
      try {
        await updateLeaveStatus(leaveId, { status: "rejected" });
        toast.success("Leave request rejected");
        await fetchLeaves(); // Refresh the list after rejection
      } catch (err) {
        console.error("Error rejecting leave:", err);
        toast.error(getErrorMessage(err));
      } finally {
        setProcessingId(null);
      }
    },
    [fetchLeaves]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeaves();
  }, [fetchLeaves]);

  // Filter to show ONLY pending leaves
  const pendingLeaves = allLeaves.filter((leave) => leave.status === "pending");
  const pendingCount = pendingLeaves.length;

  return {
    leaves: pendingLeaves, // Return only pending leaves
    allLeaves, // Optional: if you need all leaves elsewhere
    pendingCount,
    isLoading,
    error,
    processingId,
    approveLeave,
    rejectLeave,
    refreshLeaves: fetchLeaves,
  };
}
