// hooks/useDepartmentModal.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDepartment } from "@/src/services/department.service";
import type { CreateDepartmentPayload } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "@/src/utils/events"; // Import event trigger

interface UseDepartmentModalProps {
  onStatsChange?: () => void; // Keep for backward compatibility
}

export function useDepartmentModal({
  onStatsChange,
}: UseDepartmentModalProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = useCallback(() => {
    console.log("Opening department modal");
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    console.log("Closing department modal");
    setIsOpen(false);
    setError(null);
  }, []);

  const handleCreateDepartment = useCallback(
    async (data: CreateDepartmentPayload) => {
      console.log("🏢 Creating department...");
      setIsSubmitting(true);
      setError(null);
      try {
        await createDepartment(data);
        toast.success("Department created successfully");
        closeModal();

        // Refresh the page data
        router.refresh();

        // Trigger global dashboard refresh
        console.log("📢 Triggering dashboard refresh from department creation");
        triggerDashboardRefresh();

        // Call the stats update callback if provided (backward compatibility)
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
    error,
    openModal,
    closeModal,
    handleCreateDepartment,
  };
}
