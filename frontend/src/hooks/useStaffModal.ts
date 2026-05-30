// src/hooks/useStaffModal.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStaff } from "@/src/services/staff.service";
import { getAllDepartments } from "@/src/services/department.service";
import { getAllBranches, Branch } from "@/src/services/branch.service";
import type { CreateStaffInput, Department } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "@/src/utils/events";

interface UseStaffModalProps {
  onStatsChange?: () => void;
}

export function useStaffModal({ onStatsChange }: UseStaffModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = useCallback(async () => {
    console.log("Opening staff modal");
    setIsOpen(true);
    setError(null);
    // eslint-disable-next-line react-hooks/immutability
    await Promise.all([fetchDepartments(), fetchBranches()]);
  }, []);

  const closeModal = useCallback(() => {
    console.log("Closing staff modal");
    setIsOpen(false);
    setError(null);
  }, []);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchDepartments = useCallback(async () => {
    if (departments.length > 0) {
      console.log("Departments already loaded:", departments.length);
      return;
    }

    setIsLoadingDepartments(true);
    setError(null);
    try {
      const departmentsData = await getAllDepartments();
      console.log("Fetched raw departments:", departmentsData);

      // Filter out departments whose operational state is inactive
      const activeDepartments = (departmentsData || []).filter(
        (dept: Department) => dept.isActive !== false
      );

      console.log("Filtered active departments:", activeDepartments);
      setDepartments(activeDepartments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments");
      toast.error("Failed to load departments");
      setDepartments([]);
    } finally {
      setIsLoadingDepartments(false);
    }
  }, [departments.length]);

  // eslint-disable-next-line react-hooks/preserve-manual-memoization
  const fetchBranches = useCallback(async () => {
    if (branches.length > 0) {
      console.log("Branches already loaded:", branches.length);
      return;
    }

    setIsLoadingBranches(true);
    setError(null);
    try {
      const branchesData = await getAllBranches();
      console.log("Fetched branches:", branchesData);
      setBranches(branchesData || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
      // Don't show error toast for branches - it's optional
      setBranches([]);
    } finally {
      setIsLoadingBranches(false);
    }
  }, [branches.length]);

  const handleCreateStaff = useCallback(
    async (data: CreateStaffInput) => {
      console.log("👤 Creating staff with data:", data);
      setIsSubmitting(true);
      setError(null);
      try {
        await createStaff(data);
        toast.success("Staff created successfully");
        closeModal();

        router.refresh();
        triggerDashboardRefresh();

        if (onStatsChange) {
          onStatsChange();
        }
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeModal, router, onStatsChange]
  );

  return {
    isOpen,
    isSubmitting,
    isLoadingDepartments,
    isLoadingBranches,
    departments,
    branches,
    error,
    openModal,
    closeModal,
    handleCreateStaff,
    fetchDepartments,
    fetchBranches,
  };
}
