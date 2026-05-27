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
import type { Floor } from "@/src/services/floor.service";

export default function FloorMap() {
  const router = useRouter();
  const { floors, isLoading, error, addFloor, editFloor, removeFloor } =
    useFloors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredFloor, setHoveredFloor] = useState<number | null>(null);

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
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-400 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4">
          <Building2 className="h-8 w-8 text-rose-400" />
        </div>
        <p className="text-slate-500 text-sm">Something went wrong</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-3 text-xs text-rose-500 hover:text-rose-700 underline-offset-2 underline"
        >
          try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 mt-6">
      {/* Header with organic accent */}
      <div className="flex items-end justify-between border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-emerald-500 rounded-full" />
            <span className="text-[10px] font-mono text-emerald-600 tracking-[0.2em] uppercase">
              Spatial Map
            </span>
          </div>
          <h2 className="text-2xl font-light tracking-tight text-slate-800">
            Floor registry
          </h2>
          <p className="text-xs text-slate-400 max-w-md leading-relaxed">
            each floor tells a story — view occupancy, manage staff, and feel
            the pulse of your space.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="group relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[0.97] active:scale-[0.95]"
        >
          <span className="absolute inset-0 rounded-full bg-slate-900 group-hover:bg-slate-800 transition-colors duration-200" />
          <span className="relative flex items-center gap-2 text-white">
            <Plus className="h-4 w-4" />
            <span>add floor</span>
          </span>
        </button>
      </div>

      {/* Floor Grid - Organic card design */}
      {floors.length === 0 ? (
        <div className="relative py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-10">
            <Layers className="w-full h-full text-slate-400" />
          </div>
          <div className="relative">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No floors yet</p>
            <button
              onClick={openAddModal}
              className="mt-4 text-sm text-emerald-600 hover:text-emerald-700 underline decoration-dotted underline-offset-4"
            >
              create first floor
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {floors.map((floor) => {
            const occupancyPercent =
              ((floor.currentStaffCount || 0) / floor.maxCapacity) * 100;
            const isHovered = hoveredFloor === floor.id;

            return (
              <div
                key={floor.id}
                onClick={() => handleCardClick(floor.id)}
                onMouseEnter={() => setHoveredFloor(floor.id)}
                onMouseLeave={() => setHoveredFloor(null)}
                className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-200 cursor-pointer overflow-hidden"
              >
                {/* Organic corner accent */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                  <svg viewBox="0 0 100 100" fill="none">
                    <path
                      d="M100 0L100 100L0 100"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-slate-600"
                    />
                  </svg>
                </div>

                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="p-5">
                  {/* Header with actions */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-1">
                      <h3 className="font-medium text-slate-800 text-lg tracking-tight">
                        {floor.name}
                      </h3>
                      {floor.branch && (
                        <div className="flex items-center gap-1.5">
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[11px] font-mono text-slate-400 tracking-wide">
                            {floor.branch.name}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(floor);
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-slate-600 hover:bg-slate-100 transition-all"
                        title="Edit floor"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteModal(floor);
                        }}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all"
                        title="Delete floor"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Staff count - minimal */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        <span className="font-medium text-slate-800">
                          {floor.currentStaffCount || 0}
                        </span>
                        <span className="text-slate-400"> assigned</span>
                      </span>
                    </div>

                    {/* Organic progress ring instead of bar */}
                    <div className="relative w-8 h-8">
                      <svg
                        className="w-full h-full -rotate-90"
                        viewBox="0 0 36 36"
                      >
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="16"
                          fill="none"
                          stroke={
                            occupancyPercent === 100 ? "#ef4444" : "#10b981"
                          }
                          strokeWidth="2.5"
                          strokeDasharray={`${occupancyPercent * 1.005} 100`}
                          strokeLinecap="round"
                          className="transition-all duration-500"
                        />
                      </svg>
                      {occupancyPercent === 100 && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Decorative dash */}
                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-end">
                    <span className="text-[10px] font-mono text-slate-300 flex items-center gap-1 group-hover:text-slate-400 transition-colors">
                      view details
                      <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>

                {/* Bottom organic highlight */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500/0 via-emerald-500/40 to-emerald-500/0 transition-all duration-500 ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
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
