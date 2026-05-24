/* eslint-disable react-hooks/set-state-in-effect */
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
import { getAllBranches, Branch } from "@/src/services/branch.service";
import type { Staff, Department, GetAllStaffResponse } from "@/src/types";
import { getErrorMessage } from "../utils/axios";
import { triggerDashboardRefresh } from "../utils/events";

export function useStaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]); // ADD THIS
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
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

  // ADD THIS - Fetch branches
  const fetchBranches = useCallback(async () => {
    try {
      const data = await getAllBranches();
      setBranches(data || []);
    } catch (error) {
      console.error("Error fetching branches:", error);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
    fetchDepartments();
    fetchBranches(); // ADD THIS
  }, [fetchStaff, fetchDepartments, fetchBranches]);

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
      // Create a clean update object with only the fields we want to update
      const updateData: {
        name?: string;
        email?: string;
        phone?: string;
        branchId?: number;
        departmentId?: number;
        branch?: string;
      } = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.branchId !== undefined) updateData.branchId = data.branchId;
      if (data.departmentId !== undefined)
        updateData.departmentId = data.departmentId;

      // If branch is an object, extract just the name as string
      if (data.branch !== undefined) {
        if (
          data.branch &&
          typeof data.branch === "object" &&
          "name" in data.branch
        ) {
          updateData.branch = data.branch.name;
        } else if (typeof data.branch === "string") {
          updateData.branch = data.branch;
        }
      }

      await updateStaff(selectedStaff.staffId, updateData);
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
    branches,
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
