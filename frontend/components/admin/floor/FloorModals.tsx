// components/admin/FloorModals.tsx
"use client";

import { useState } from "react";
import { X, Building2, Users, Plus, Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";

// Add Floor Modal
interface AddFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; maxCapacity: number }) => void;
  isSubmitting: boolean;
}

export function AddFloorModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
}: AddFloorModalProps) {
  const [name, setName] = useState("");
  const [maxCapacity, setMaxCapacity] = useState(10);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({ name, maxCapacity });
      setName("");
      setMaxCapacity(10);
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
          />
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
            disabled={isSubmitting || !name.trim()}
            className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? "Adding..." : "Add Floor"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// Assign Staff Modal
interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  floorName: string;
  availableStaff: Array<{
    id: number;
    staffId: string;
    name: string;
    currentFloor?: string;
  }>;
  assignedStaff: Array<{ id: number; staffId: string; name: string }>;
  onAssign: (staffId: number) => void;
  onRemove: (staffId: number) => void;
  isSubmitting: boolean;
}

export function AssignStaffModal({
  isOpen,
  onClose,
  floorName,
  availableStaff,
  assignedStaff,
  onAssign,
  onRemove,
  isSubmitting,
}: AssignStaffModalProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStaff = availableStaff.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.staffId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Assign Staff to ${floorName}`}
      size="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search staff by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 pl-10 rounded-lg border border-slate-200 focus:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-100 text-sm"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Available Staff */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-700">
                Available Staff
              </h4>
              <span className="text-xs text-slate-400">
                {filteredStaff.length} staff
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {filteredStaff.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No staff available
                </div>
              ) : (
                filteredStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {staff.name}
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        {staff.staffId}
                      </p>
                    </div>
                    <button
                      onClick={() => onAssign(staff.id)}
                      disabled={isSubmitting}
                      className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assigned Staff */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-700">
                Assigned Staff
              </h4>
              <span className="text-xs text-slate-400">
                {assignedStaff.length} staff
              </span>
            </div>
            <div className="border border-slate-200 rounded-lg divide-y divide-slate-100 max-h-96 overflow-y-auto">
              {assignedStaff.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No staff assigned
                </div>
              ) : (
                assignedStaff.map((staff) => (
                  <div
                    key={staff.id}
                    className="p-3 flex items-center justify-between hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {staff.name}
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        {staff.staffId}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemove(staff.id)}
                      disabled={isSubmitting}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
