// components/admin/FloorMap.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit2,
  Trash2,
  Users,
  Building2,
  ChevronRight,
  Layers,
} from "lucide-react";
import { useFloors } from "@/src/hooks/floor/useFloors";
import { useFloorUIStore } from "@/src/stores/floorStore";
import AddFloorModal from "../floor/AddFloorModal";
import EditFloorModal from "../floor/EditFloorModal";
import DeleteFloorModal from "../floor/DeleteFloorModal";

export default function FloorMap() {
  const router = useRouter();
  const { floors, isLoading, error, addFloor, editFloor, removeFloor } =
    useFloors();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    isAddModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    editingFloor,
    deletingFloor,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal,
    openDeleteModal,
    closeDeleteModal,
  } = useFloorUIStore();

  const handleAddFloor = async (data: {
    name: string;
    maxCapacity: number;
    branchId: number;
  }) => {
    setIsSubmitting(true);
    try {
      await addFloor(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditFloor = async (
    id: number,
    data: { name: string; maxCapacity: number; branchId: number }
  ) => {
    setIsSubmitting(true);
    try {
      await editFloor(id, data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFloor = async (id: number) => {
    setIsSubmitting(true);
    try {
      await removeFloor(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = (floorId: number) => {
    router.push(`/admin/floor/${floorId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="w-10 h-10 rounded-full border-2 border-slate-200 border-t-slate-900 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center antialiased">
        <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center mb-3">
          <Building2 className="h-5 w-5 text-rose-500" />
        </div>
        <p className="text-slate-900 font-semibold text-sm">
          Failed to load floor maps
        </p>
        <p className="text-xs text-slate-400 mt-0.5">
          Please check your connectivity or backend configuration status.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-1.5 rounded-md text-xs font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6 antialiased">
      {/* Header Alignment Block */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider uppercase">
              Spatial Overview
            </span>
          </div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Floor Registry
          </h2>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed font-normal">
            Monitor capacity, assign operational resources, and track active
            location layout structures.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium text-white bg-[#0F0F11] hover:bg-slate-800 transition-all duration-200 shadow-xs"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Floor</span>
        </button>
      </div>

      {/* Grid Content Layout Render Matrix */}
      {floors.length === 0 ? (
        <div className="relative py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
          <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-900 font-semibold text-sm">
            No floors established yet
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Get started by allocating your first physical floor segment layout.
          </p>
          <button
            onClick={openAddModal}
            className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-900 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            Create First Floor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {floors.map((floor) => {
            const currentStaff = floor.currentStaffCount || 0;
            const capacity = floor.maxCapacity || 1;
            const occupancyPercent = Math.min(
              Math.max((currentStaff / capacity) * 100, 0),
              100
            );

            // Standard SVG Circle Arc Configurations for exact radius math
            const radius = 14;
            const circumference = 2 * Math.PI * radius;
            const strokeDashoffset =
              circumference - (occupancyPercent / 100) * circumference;

            return (
              <div
                key={floor.id}
                onClick={() => handleCardClick(floor.id)}
                className="group relative bg-white rounded-xl border border-slate-200/60 shadow-xs transition-all duration-200 hover:shadow-md hover:border-slate-300 cursor-pointer overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5">
                  {/* Top Line Card Header Context */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-slate-900 transition-colors">
                        {floor.name}
                      </h3>
                      {floor.branch && (
                        <span className="inline-block text-[11px] font-medium text-slate-400">
                          {floor.branch.name}
                        </span>
                      )}
                    </div>

                    {/* Action Panel Utilities Drawer */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(floor);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all"
                        title="Edit floor parameters"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(floor);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100/50 transition-all"
                        title="Remove floor node"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Quantitative Resource Allocation Matrix */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-medium">
                        <span className="font-bold text-slate-900">
                          {currentStaff}
                        </span>
                        <span className="text-slate-400">
                          {" "}
                          / {capacity} Staff Assigned
                        </span>
                      </span>
                    </div>

                    {/* Circle Indicator Graph Display Component */}
                    <div className="relative w-8 h-8 shrink-0">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 32 32"
                      >
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="3"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r={radius}
                          fill="none"
                          stroke={
                            occupancyPercent >= 100 ? "#f43f5e" : "#0f0f11"
                          }
                          strokeWidth="3"
                          strokeDasharray={circumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      {occupancyPercent >= 100 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Interactive Navigation Ribbon Action */}
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end group-hover:bg-slate-50 transition-colors">
                  <span className="text-[10px] font-mono font-medium text-slate-400 flex items-center gap-1 group-hover:text-slate-900 transition-colors">
                    View Details
                    <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals Mounting Segment */}
      <AddFloorModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onAdd={handleAddFloor}
        isSubmitting={isSubmitting}
      />

      <EditFloorModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        floor={editingFloor}
        onEdit={handleEditFloor}
        isSubmitting={isSubmitting}
      />

      <DeleteFloorModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        floor={deletingFloor}
        onDelete={handleDeleteFloor}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
