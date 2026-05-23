// hooks/useDepartmentModal.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createDepartment } from "@/src/services/department.service";
import type { CreateDepartmentPayload } from "@/src/types";
import { getErrorMessage } from "../utils/axios";

export function useDepartmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleCreateDepartment = async (data: CreateDepartmentPayload) => {
    setIsSubmitting(true);
    try {
      await createDepartment(data);
      toast.success("Department created successfully");
      closeModal();
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isOpen,
    isSubmitting,
    openModal,
    closeModal,
    handleCreateDepartment,
  };
}
