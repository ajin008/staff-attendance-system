// components/admin/EditStaffModal.tsx
"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Modal from "../ui/Modal";
import type { Staff, Department } from "@/src/types";
import type { Branch } from "@/src/services/branch.service";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  departments: Department[];
  branches: Branch[];
  isSubmitting: boolean;
  onSubmit: (data: Partial<Staff>) => void;
}

export default function EditStaffModal({
  isOpen,
  onClose,
  staff,
  departments,
  branches,
  isSubmitting,
  onSubmit,
}: EditStaffModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Partial<Staff>>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      branch: undefined,
      branchId: undefined,
      departmentId: undefined,
    },
  });

  const selectedBranchId = watch("branchId");

  // Auto-populate branch name when branchId changes
  useEffect(() => {
    if (selectedBranchId) {
      const branch = branches.find((b) => b.id === Number(selectedBranchId));
      if (branch) {
        // For form display, we store the branch object
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setValue("branch", branch as any);
      }
    } else if (selectedBranchId === undefined || selectedBranchId === 0) {
      setValue("branch", undefined);
    }
  }, [selectedBranchId, branches, setValue]);

  // Reset form with staff data when modal opens or staff changes
  useEffect(() => {
    if (staff && isOpen) {
      reset({
        name: staff.name || "",
        email: staff.email || "",
        phone: staff.phone || "",
        branch: staff.branch,
        branchId: staff.branch?.id, // Get branchId from branch object
        departmentId: staff.department?.id,
      });
    }
  }, [staff, isOpen, reset]);

  if (!staff) return null;

  const onFormSubmit = (data: Partial<Staff>) => {
    // Clean up data before sending
    const submitData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      branchId: data.branchId ? Number(data.branchId) : undefined,
      departmentId: data.departmentId ? Number(data.departmentId) : undefined,
    };
    onSubmit(submitData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee" size="md">
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Staff ID Display */}
        <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
          <p className="text-xs text-slate-400 mb-1">Staff ID</p>
          <p className="text-sm font-mono text-slate-600">{staff.staffId}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
          />
          {errors.name && (
            <p className="text-xs text-red-400 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Phone
          </label>
          <input
            type="tel"
            {...register("phone")}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
          />
        </div>

        {/* Branch Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Branch
          </label>
          <select
            {...register("branchId", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm cursor-pointer bg-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            <option value="">Select branch (optional)</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Select a branch to assign staff location
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Department
          </label>
          <select
            {...register("departmentId", { valueAsNumber: true })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm cursor-pointer bg-white"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 1rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1.25rem",
            }}
          >
            <option value="">Select department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
