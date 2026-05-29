/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/staff/useStaffFloorAllocation.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMyFloorAllocation,
  FloorAllocation,
} from "../../services/floor.service";
import { getErrorMessage } from "../../utils/axios";
import { toast } from "sonner";

interface UseStaffFloorAllocationReturn {
  isAssigned: boolean;
  allocation: FloorAllocation | null;
  isLoading: boolean;
  error: string | null;
  refreshAllocation: () => Promise<void>;
}

export function useStaffFloorAllocation(): UseStaffFloorAllocationReturn {
  const [isAssigned, setIsAssigned] = useState<boolean>(false);
  const [allocation, setAllocation] = useState<FloorAllocation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getMyFloorAllocation();
      setIsAssigned(response.data.assigned);
      setAllocation(response.data.allocation);
    } catch (err) {
      const errorMsg = getErrorMessage(err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllocation();
  }, [fetchAllocation]);

  return {
    isAssigned,
    allocation,
    isLoading,
    error,
    refreshAllocation: fetchAllocation,
  };
}
