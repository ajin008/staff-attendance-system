// src/hooks/useBranches.ts
import useSWR from "swr";
import { getAllBranches, Branch } from "../../services/branch.service";

const BRANCHES_KEY = "/admin/branches";

export function useBranches() {
  const {
    data: branches,
    error,
    isLoading,
    mutate,
  } = useSWR(BRANCHES_KEY, getAllBranches, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });

  return {
    branches: branches || [],
    isLoading,
    error,
    refreshBranches: mutate,
  };
}
