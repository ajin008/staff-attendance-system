/* eslint-disable react-hooks/set-state-in-effect */
// hooks/useDepartmentManagement.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  getAllDepartmentsPaginated, // Changed to use paginated version
  deleteDepartment,
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

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset page when search term changes
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

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      await deleteDepartment(selectedDepartment.id);
      toast.success("Department deleted successfully");
      triggerDashboardRefresh();
      setIsDeleteModalOpen(false);
      setSelectedDepartment(null);
      fetchDepartments();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmUpdate = async (data: Partial<Department>) => {
    if (!selectedDepartment) return;

    setIsSubmitting(true);
    try {
      await updateDepartment(selectedDepartment.id, data);
      toast.success("Department updated successfully");
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
    isDeleteModalOpen,
    selectedDepartment,
    isSubmitting,
    setCurrentPage,
    handleView,
    handleEdit,
    handleDelete,
    confirmDelete,
    confirmUpdate,
    handleSearch,
    closeViewModal: () => setIsViewModalOpen(false),
    closeEditModal: () => setIsEditModalOpen(false),
    closeDeleteModal: () => setIsDeleteModalOpen(false),
  };
}
