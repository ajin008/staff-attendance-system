// hooks/useStaffModal.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createStaff } from "@/src/services/staff.service";
import { getAllDepartments } from "@/src/services/department.service";
import type { CreateStaffInput, Department } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "@/src/utils/events"; // Import event trigger

interface UseStaffModalProps {
  onStatsChange?: () => void; // Keep for backward compatibility
}

export function useStaffModal({ onStatsChange }: UseStaffModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = useCallback(async () => {
    console.log("Opening staff modal");
    setIsOpen(true);
    setError(null);
    // eslint-disable-next-line react-hooks/immutability
    await fetchDepartments();
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
      console.log("Fetched departments:", departmentsData);
      setDepartments(departmentsData || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
      setError("Failed to load departments");
      toast.error("Failed to load departments");
      setDepartments([]);
    } finally {
      setIsLoadingDepartments(false);
    }
  }, [departments.length]);

  const handleCreateStaff = useCallback(
    async (data: CreateStaffInput) => {
      console.log("👤 Creating staff...");
      setIsSubmitting(true);
      setError(null);
      try {
        await createStaff(data);
        toast.success("Staff created successfully");
        closeModal();

        // Refresh the page data
        router.refresh();

        // Trigger global dashboard refresh
        console.log("📢 Triggering dashboard refresh from staff creation");
        triggerDashboardRefresh();

        // Call the stats update callback if provided (backward compatibility)
        if (onStatsChange) {
          onStatsChange();
        }
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
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
    departments,
    error,
    openModal,
    closeModal,
    handleCreateStaff,
    fetchDepartments,
  };
}
