// src/hooks/useMyLeaves.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import useSWR from "swr";
import { getMyLeaves, Leave } from "../../services/leave.service";
import { getErrorMessage } from "./../../utils/axios";
import { toast } from "sonner";

const MY_LEAVES_KEY = "/leaves/my-leaves";

export function useMyLeaves() {
  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(MY_LEAVES_KEY, getMyLeaves, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });

  const leaves = response?.leaves || [];

  const refreshLeaves = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    leaves,
    isLoading,
    error: error ? getErrorMessage(error) : null,
    refreshLeaves,
  };
}
