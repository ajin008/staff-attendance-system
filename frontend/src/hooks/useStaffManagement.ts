// hooks/useStaffManagement.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  getAllStaff,
  deleteStaff,
  updateStaff,
} from "@/src/services/staff.service";
import { getAllDepartments } from "@/src/services/department.service";
import type { Staff, Department, GetAllStaffResponse } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "../utils/events";

export function useStaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500); // 500ms delay
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset page when search term changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: GetAllStaffResponse = await getAllStaff(
        currentPage,
        10,
        debouncedSearchTerm
      );
      setStaff(data.staffs || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalStaff(data.pagination?.total || 0);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff();
    fetchDepartments();
  }, [fetchStaff, fetchDepartments]);

  const handleView = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleDelete = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStaff) return;

    setIsSubmitting(true);
    try {
      await deleteStaff(selectedStaff.staffId);
      toast.success("Staff deleted successfully");
      triggerDashboardRefresh();
      setIsDeleteModalOpen(false);
      setSelectedStaff(null);
      fetchStaff();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmUpdate = async (data: Partial<Staff>) => {
    if (!selectedStaff) return;

    setIsSubmitting(true);
    try {
      await updateStaff(selectedStaff.staffId, data);
      toast.success("Staff updated successfully");
      triggerDashboardRefresh();
      setIsEditModalOpen(false);
      setSelectedStaff(null);
      fetchStaff();
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
    staff,
    departments,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalStaff,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedStaff,
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
