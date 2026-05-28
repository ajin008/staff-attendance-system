/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useDepartmentManagement.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  getAllDepartmentsPaginated,
  toggleDepartmentStatus, // Integrated the updated micro-service call
  updateDepartment,
} from "@/src/services/department.service";
import type { Department, GetAllDepartmentsResponse } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "../utils/events";

export function useDepartmentManagement() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalDepartments, setTotalDepartments] = useState(0);

  // Structural Modal States Array
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Parameter boundary adjustment reset hook
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: GetAllDepartmentsResponse = await getAllDepartmentsPaginated(
        currentPage,
        10,
        debouncedSearchTerm
      );
      setDepartments(data.departments || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalDepartments(data.pagination?.total || 0);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleView = (department: Department) => {
    setSelectedDepartment(department);
    setIsViewModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsEditModalOpen(true);
  };

  // Immediate mutation interaction controller mapping
  const handleToggleStatus = async (department: Department) => {
    const nextState = !department.isActive;
    const trackingToastId = toast.loading(
      `Transitioning operational metrics array for ${department.name}...`
    );

    try {
      await toggleDepartmentStatus(department.id, nextState);

      // Immediate structural array reflection map bypassing network retrieval
      setDepartments((prevDepartments) =>
        prevDepartments.map((d) =>
          d.id === department.id ? { ...d, isActive: nextState } : d
        )
      );

      toast.success(`${department.name} state successfully synchronized`, {
        id: trackingToastId,
      });
      triggerDashboardRefresh();
    } catch (error) {
      toast.error(getErrorMessage(error), { id: trackingToastId });
    }
  };

  const confirmUpdate = async (data: Partial<Department>) => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      await updateDepartment(selectedDepartment.id, data);
      toast.success("Department parameters modified successfully");
      triggerDashboardRefresh();
      setIsEditModalOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return {
    departments,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalDepartments,
    isViewModalOpen,
    isEditModalOpen,
    selectedDepartment,
    isSubmitting,
    setCurrentPage,
    handleView,
    handleEdit,
    handleToggleStatus,
    confirmUpdate,
    handleSearch,
    closeViewModal: () => setIsViewModalOpen(false),
    closeEditModal: () => setIsEditModalOpen(false),
  };
}
