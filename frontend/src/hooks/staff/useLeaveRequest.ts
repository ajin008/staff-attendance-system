// src/hooks/useLeaveRequest.ts
"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CreateLeavePayload } from "@/src/types";
import { getErrorMessage } from "@/src/utils/axios";
import { createLeaveRequest } from "./../../services/leave.service";
interface UseLeaveRequestProps {
  onSuccess?: () => void;
}

export function useLeaveRequest({ onSuccess }: UseLeaveRequestProps = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const openModal = useCallback(() => {
    setIsOpen(true);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const submitLeaveRequest = useCallback(
    async (data: CreateLeavePayload) => {
      setIsSubmitting(true);
      setError(null);

      try {
        await createLeaveRequest(data);
        toast.success("Leave request submitted successfully");
        closeModal();

        if (onSuccess) {
          onSuccess();
        }

        router.refresh();
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        toast.error(errorMsg);
        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [closeModal, router, onSuccess]
  );

  return {
    isOpen,
    isSubmitting,
    error,
    openModal,
    closeModal,
    submitLeaveRequest,
  };
}
