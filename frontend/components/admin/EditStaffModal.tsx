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
        branchId: staff.branch?.id,
        departmentId: staff.department?.id,
      });
    }
  }, [staff, isOpen, reset]);

  if (!staff) return null;

  const onFormSubmit = (data: Partial<Staff>) => {
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
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="space-y-4 antialiased"
      >
        {/* Flat Staff ID Core Node Node Block */}
        <div className="bg-slate-50 rounded-md p-3 border border-slate-200/60">
          <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-0.5">
            System Node Staff ID
          </p>
          <p className="text-xs font-mono font-bold text-slate-800">
            {staff.staffId}
          </p>
        </div>

        {/* Input Text Section Matrix Row */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-tight">
            Full Name <span className="text-rose-500 font-normal">*</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-xs font-medium text-slate-900 transition-colors placeholder:text-slate-300"
          />
          {errors.name && (
            <p className="text-[11px] font-medium text-rose-500 mt-0.5">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Address Section Row */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-tight">
            Email Address <span className="text-rose-500 font-normal">*</span>
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
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-xs font-medium text-slate-900 transition-colors placeholder:text-slate-300"
          />
          {errors.email && (
            <p className="text-[11px] font-medium text-rose-500 mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Comms Vector Identifier Row */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-tight">
            Phone Identifier
          </label>
          <input
            type="text"
            {...register("phone")}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-xs font-mono text-slate-900 transition-colors placeholder:text-slate-300"
            placeholder="+910000000000"
          />
        </div>

        {/* Branch Allocation Node Selector Menu */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-tight">
            Branch Allocation Location
          </label>
          <select
            {...register("branchId", { valueAsNumber: true })}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-xs font-medium text-slate-900 transition-colors cursor-pointer bg-white appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.85rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1rem",
            }}
          >
            <option value="">
              Select operational branch location (optional)
            </option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          <p className="text-[10px] text-slate-400 font-normal">
            Assign regional physical workspace anchor coordinates.
          </p>
        </div>

        {/* Operational Group Cluster Department Dropdown Vector */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-slate-800 uppercase tracking-tight">
            Department Cluster Segment
          </label>
          <select
            {...register("departmentId", { valueAsNumber: true })}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 focus:border-slate-900 focus:outline-none text-xs font-medium text-slate-900 transition-colors cursor-pointer bg-white appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 0.85rem center",
              backgroundRepeat: "no-repeat",
              backgroundSize: "1rem",
            }}
          >
            <option value="">Select core infrastructure department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        {/* Structural Form Control Matrix Interface Actions */}
        <div className="flex gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all focus:outline-none"
          >
            Cancel Allocation
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2 bg-slate-900 border border-slate-950 rounded-md text-xs font-bold uppercase tracking-wider text-white hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all focus:outline-none"
          >
            {isSubmitting ? "Writing Registry Data..." : "Apply Layout Shifts"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
