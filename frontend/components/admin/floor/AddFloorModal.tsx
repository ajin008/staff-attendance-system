// components/floor/AddFloorModal.tsx
"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
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

  const selectDropdownStyles = {
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`,
    backgroundPosition: "right 14px center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "16px",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Floor" size="md">
      <form onSubmit={handleSubmit} className="space-y-5 antialiased">
        {/* Floor Name Input Box */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 tracking-tight block">
            Floor Name <span className="text-slate-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Ground Floor, First Floor"
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white placeholder:text-slate-400 focus:outline-none focus:border-slate-900 focus:ring-0"
            required
            autoFocus
          />
        </div>

        {/* Branch Selection Dropdown */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 tracking-tight block">
            Branch <span className="text-slate-400">*</span>
          </label>
          <select
            value={branchId}
            onChange={(e) => setBranchId(parseInt(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0 appearance-none cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
            required
            disabled={branchesLoading}
            style={selectDropdownStyles}
          >
            <option value={0}>Select a branch</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
          {branchesLoading && (
            <p className="text-[11px] text-slate-400 font-medium">
              Loading branches...
            </p>
          )}
          {!branchesLoading && branches.length === 0 && (
            <p className="text-[11px] text-amber-600 font-medium">
              No branches available. Please create a branch first.
            </p>
          )}
        </div>

        {/* Max Capacity Input Box */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 tracking-tight block">
            Max Capacity <span className="text-slate-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="500"
            value={maxCapacity}
            onChange={(e) => setMaxCapacity(parseInt(e.target.value))}
            className="w-full px-3.5 py-2 rounded-md border border-slate-200 text-sm font-medium transition-all bg-white text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-0"
            required
          />
          <p className="text-[11px] text-slate-400 leading-normal">
            Maximum number of staff working on this floor
          </p>
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
            type="submit"
            disabled={
              isSubmitting || !name.trim() || branchId === 0 || branchesLoading
            }
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#0F0F11] hover:bg-slate-800 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FolderPlus className="h-3.5 w-3.5" />
                <span>Add Floor</span>
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
