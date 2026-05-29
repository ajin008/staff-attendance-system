// components/admin/StatusToggleModal.tsx
"use client";

import { AlertTriangle, UserCheck, UserX } from "lucide-react";
import Modal from "../ui/Modal";
import type { Staff } from "@/src/types";

interface StatusToggleModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  isSubmitting: boolean;
  onConfirm: () => void;
}

export default function StatusToggleModal({
  isOpen,
  onClose,
  staff,
  isSubmitting,
  onConfirm,
}: StatusToggleModalProps) {
  if (!staff) return null;

  const isActivating = !staff.isActive;
  const title = isActivating ? "Activate Employee" : "Resign Employee";
  const description = isActivating
    ? `Are you sure you want to activate ${staff.name}?`
    : `Are you sure you want to mark ${staff.name} as resigned?`;
  const buttonText = isActivating ? "Activate" : "Resign";
  const buttonColor = isActivating
    ? "bg-emerald-500 hover:bg-emerald-600"
    : "bg-amber-500 hover:bg-amber-600";
  const Icon = isActivating ? UserCheck : UserX;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="text-center">
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
            isActivating ? "bg-emerald-50" : "bg-amber-50"
          }`}
        >
          <Icon
            className={`h-6 w-6 ${
              isActivating ? "text-emerald-500" : "text-amber-500"
            }`}
          />
        </div>
        <h3 className="text-lg font-medium text-slate-800 mb-2">{title}</h3>
        <p className="text-sm text-slate-500 mb-4">
          {description}
          <br />
          <span className="text-xs">Staff ID: {staff.staffId}</span>
          <br />
          <span className="text-xs">
            {isActivating
              ? "This employee will regain access to the system."
              : "This employee will lose access to the system."}
          </span>
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
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white ${buttonColor} disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
          >
            {isSubmitting ? "Processing..." : buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
