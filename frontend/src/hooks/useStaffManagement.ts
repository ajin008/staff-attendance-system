// hooks/useStaffManagement.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  getAllStaff,
  toggleStaffStatus,
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
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalStaff, setTotalStaff] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "resigned"
  >("all");

  // Modal states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    try {
      const data: GetAllStaffResponse = await getAllStaff(
        currentPage,
        10,
        debouncedSearchTerm,
        statusFilter === "all" ? undefined : statusFilter === "active"
      );
      setStaff(data.staffs || []);
      setTotalPages(data.pagination?.totalPages || 0);
      setTotalStaff(data.pagination?.total || 0);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchDepartments = useCallback(async () => {
    try {
      const data = await getAllDepartments();
      setDepartments(data || []);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }, []);

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
    fetchBranches();
  }, [fetchStaff, fetchDepartments, fetchBranches]);

  const handleView = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const handleEdit = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsEditModalOpen(true);
  };

  const handleStatusToggle = (staffMember: Staff) => {
    setSelectedStaff(staffMember);
    setIsStatusModalOpen(true);
  };

  const confirmStatusToggle = async () => {
    if (!selectedStaff) return;

    setIsSubmitting(true);
    const newStatus = !selectedStaff.isActive;
    const actionText = newStatus ? "activate" : "resign";

    try {
      await toggleStaffStatus(selectedStaff.staffId, newStatus);
      toast.success(`Staff ${actionText}d successfully`);
      triggerDashboardRefresh();
      setIsStatusModalOpen(false);
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
    statusFilter,
    isViewModalOpen,
    isEditModalOpen,
    isStatusModalOpen,
    selectedStaff,
    isSubmitting,
    setCurrentPage,
    setStatusFilter,
    handleView,
    handleEdit,
    handleStatusToggle,
    confirmStatusToggle,
    confirmUpdate,
    handleSearch,
    closeViewModal: () => setIsViewModalOpen(false),
    closeEditModal: () => setIsEditModalOpen(false),
    closeStatusModal: () => setIsStatusModalOpen(false),
  };
}
