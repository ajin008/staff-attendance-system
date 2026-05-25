// components/floor/DeleteFloorModal.tsx
"use client";
import Modal from "@/components/ui/Modal";
import type { Floor } from "@/src/services/floor.service";
import { AlertTriangle } from "lucide-react";

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

  const hasStaff = floor.staff && floor.staff.length > 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Floor" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <p className="text-sm text-amber-700">
            This action cannot be undone.
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-medium">{floor.name}</span>?
          </p>
          {hasStaff && (
            <p className="text-xs text-red-500 mt-2">
              ⚠️ This floor has {floor.staff?.length || 0} staff assigned. They
              will need to be reassigned.
            </p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Deleting..." : "Delete Floor"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
