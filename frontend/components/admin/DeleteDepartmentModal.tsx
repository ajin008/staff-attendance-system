// components/admin/DeleteDepartmentModal.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import type { Department } from "@/src/types";

interface DeleteDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export default function DeleteDepartmentModal({
  isOpen,
  onClose,
  department,
  isSubmitting,
  onConfirm,
}: DeleteDepartmentModalProps) {
  if (!department) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Department"
      size="sm"
    >
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700">{department.name}</span>?
          <br />
          <span className="text-xs">
            This will also remove all staff members in this department.
          </span>
          <br />
          <span className="text-xs">This action cannot be undone.</span>
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
