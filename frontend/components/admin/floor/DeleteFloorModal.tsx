// components/floor/DeleteFloorModal.tsx
"use client";

import { AlertTriangle, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { Floor } from "@/src/services/floor.service";

interface DeleteFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  floor: Floor | null;
  onDelete: (id: number) => Promise<void>;
  isSubmitting: boolean;
}

export default function DeleteFloorModal({
  isOpen,
  onClose,
  floor,
  onDelete,
  isSubmitting,
}: DeleteFloorModalProps) {
  const handleConfirm = async () => {
    if (floor) {
      await onDelete(floor.id);
      onClose();
    }
  };

  if (!floor) return null;

  // Safeguard checking both currentStaffCount count metadata and array definitions safely
  const staffCount = floor.currentStaffCount || floor.staff?.length || 0;
  const hasStaff = staffCount > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Floor" size="md">
      <div className="space-y-5 antialiased">
        {/* Warning Indicator Container Box */}
        <div className="flex items-start gap-3 p-3.5 bg-rose-50/50 rounded-lg border border-rose-100/80">
          <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-rose-900 tracking-tight">
              This action cannot be undone
            </p>
            <p className="text-[11px] font-medium text-rose-700/90 leading-normal">
              Once deleted, this floor layout will be permanently removed from
              your dashboard registry.
            </p>
          </div>
        </div>

        {/* Dynamic Context Description String */}
        <div className="space-y-1 py-1">
          <p className="text-sm font-medium text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-bold text-slate-900">“{floor.name}”</span>?
          </p>

          {hasStaff && (
            <p className="text-[11px] font-medium text-amber-600 bg-amber-50/50 border border-amber-100/60 rounded-md px-3 py-2 mt-3 leading-normal">
              ⚠️ Attention: This floor has{" "}
              <span className="font-bold text-amber-900">
                {staffCount} staff
              </span>{" "}
              assigned. They will lose their floor assignment and will need to
              be assigned to a new floor layout.
            </p>
          )}
        </div>

        {/* Global Modal Actions Footer Row */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 transition-all duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete Floor</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
