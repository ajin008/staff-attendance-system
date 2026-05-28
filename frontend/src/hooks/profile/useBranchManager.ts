// src/hooks/profile/useBranchManager.ts
import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/src/utils/axios";
import {
  type Branch,
  addBranch,
  deleteBranch,
} from "@/src/services/profile.service";

export function useBranchManager(initialBranches: Branch[]) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [isSaving, setIsSaving] = useState(false);

  // 1. Instantly trigger atomic addBranch API endpoint
  const handleAddBranchAtomically = async (newBranchData: {
    name: string;
    latitude: number;
    longitude: number;
  }) => {
    setIsSaving(true);
    try {
      const payload = {
        ...newBranchData,
        allowedRadius: 100, // Or whatever fallback radius your backend wants
      };

      const response = await addBranch(payload);

      // Update UI state with the saved branch object returned from server (contains DB ID)
      setBranches((prev) => [...prev, response.branch]);
      toast.success(response.message || "Branch node deployed successfully");
      return true;
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to initialize branch node");
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Instantly trigger atomic deleteBranch API endpoint
  const handleRemoveBranchAtomically = async (
    indexToRemove: number,
    branchId?: number
  ) => {
    // If the branch doesn't have a DB ID yet, just filter it out locally
    if (!branchId) {
      setBranches((prev) => prev.filter((_, index) => index !== indexToRemove));
      return;
    }

    setIsSaving(true);
    try {
      const response = await deleteBranch(branchId);
      setBranches((prev) => prev.filter((_, index) => index !== indexToRemove));
      toast.success(
        response.message || "Branch node removed from infrastructure"
      );
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to destroy branch node");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    branches,
    setBranches,
    isSaving,
    handleAddBranchAtomically,
    handleRemoveBranchAtomically,
  };
}
