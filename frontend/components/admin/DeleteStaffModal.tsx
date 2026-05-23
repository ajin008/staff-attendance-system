// components/admin/DeleteStaffModal.tsx
"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "../ui/Modal";
import type { Staff } from "@/src/types";

interface DeleteStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export default function DeleteStaffModal({
  isOpen,
  onClose,
  staff,
  isSubmitting,
  onConfirm,
}: DeleteStaffModalProps) {
  if (!staff) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Employee" size="sm">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">
          Confirm Deletion
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Are you sure you want to delete{" "}
          <span className="font-medium text-slate-700">{staff.name}</span>?
          <br />
          <span className="text-xs">Staff ID: {staff.staffId}</span>
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
