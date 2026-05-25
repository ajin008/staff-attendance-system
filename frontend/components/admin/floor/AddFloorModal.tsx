// components/floor/AddFloorModal.tsx
"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import { useBranches } from "@/src/hooks/floor/useBranches";

interface AddFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    maxCapacity: number;
    branchId: number;
  }) => Promise<void>;
  isSubmitting: boolean;
}

export default function AddFloorModal({
  isOpen,
  onClose,
  onAdd,
  isSubmitting,
}: AddFloorModalProps) {
  const [name, setName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(10);
  const [branchId, setBranchId] = useState<number>(0);

  const { branches, isLoading: branchesLoading } = useBranches();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && branchId > 0) {
      await onAdd({ name, maxCapacity, branchId });
      setName("");
      setMaxCapacity(10);
      setBranchId(0);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Floor" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Floor Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., First Floor, Ground Floor"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Branch <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <select
              value={branchId}
              onChange={(e) => setBranchId(parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm appearance-none bg-white"
              required
              disabled={branchesLoading}
            >
              <option value={0}>Select a branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            <Building2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>
          {branchesLoading && (
            <p className="text-xs text-slate-400 mt-1">Loading branches...</p>
          )}
          {!branchesLoading && branches.length === 0 && (
            <p className="text-xs text-amber-600 mt-1">
              No branches available. Please create a branch first.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Max Capacity <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
            required
          />
          <p className="text-xs text-slate-400 mt-1">
            Number of seats/workstations on this floor
          </p>
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
            disabled={
              isSubmitting || !name.trim() || branchId === 0 || branchesLoading
            }
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add Floor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
