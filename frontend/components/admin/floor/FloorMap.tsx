// components/admin/floor/FloorMap.tsx
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

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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
    <div className="space-y-6 antialiased">
      {/* Hero Header Block - Full width like admin dashboard */}
      <div className="w-full bg-[#0F0F11] text-white pt-10 pb-16 border-b border-neutral-900">
        <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {/* Left Column: Context Metadata */}
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
              <span>Spatial Overview</span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-300">Floor Management</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-1">
              Floor Registry
            </h1>

            <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed max-w-xl">
              Monitor capacity metrics, assign operational resources, and track
              active location layout structures across your facility.
            </p>
          </div>

          {/* Right Column: Operational Date Badge */}
          <div className="sm:text-right self-end sm:self-start pt-1">
            <span className="text-xs font-mono font-medium tracking-wider text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-md inline-block whitespace-nowrap">
              {getFormattedDate()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area - Floor Grid */}
      <div className="w-full max-w-[1600px] mx-auto px-6 pb-16">
        {/* Section Header */}
        <div className="flex items-end justify-between border-b border-slate-100 pb-5 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium text-slate-400 tracking-wider uppercase">
                Floor Directory
              </span>
            </div>
            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              All Floor Segments
            </h2>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed font-normal">
              View and manage individual floor layouts and capacity allocations.
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

        {/* Grid Content */}
        {floors.length === 0 ? (
          <div className="relative py-16 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <Building2 className="h-8 w-8 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-900 font-semibold text-sm">
              No floors established yet
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Get started by allocating your first physical floor segment
              layout.
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

              const radius = 14;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset =
                circumference - (occupancyPercent / 100) * circumference;

              return (
                <div
                  key={floor.id}
                  onClick={() => handleCardClick(floor.id)}
                  className="group relative bg-gradient-to-br from-white to-slate-50/50 rounded-xl border border-slate-200/80 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300 hover:-translate-y-0.5 cursor-pointer overflow-hidden"
                >
                  {/* Decorative top bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-900 to-slate-700" />

                  <div className="p-5">
                    {/* Header Section */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {/* Icon with background */}
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-slate-900 transition-colors duration-200">
                            <Building2 className="h-3.5 w-3.5 text-slate-600 group-hover:text-white transition-colors" />
                          </div>
                          <h3 className="font-bold text-slate-900 text-base tracking-tight group-hover:text-slate-800">
                            {floor.name}
                          </h3>
                        </div>
                        {floor.branch && (
                          <div className="flex items-center gap-1.5 ml-7">
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-[11px] font-medium text-slate-500">
                              {floor.branch.name}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(floor);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all"
                          title="Edit floor parameters"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openDeleteModal(floor);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                          title="Remove floor node"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="mt-5">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-xs font-medium text-slate-500">
                            Occupancy
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-900">
                          {currentStaff} / {capacity}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                            occupancyPercent >= 90
                              ? "bg-rose-500"
                              : occupancyPercent >= 70
                              ? "bg-amber-500"
                              : "bg-emerald-500"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>

                      {/* Percentage indicator */}
                      <div className="flex justify-end mt-1.5">
                        <span
                          className={`text-[10px] font-mono font-medium ${
                            occupancyPercent >= 90
                              ? "text-rose-500"
                              : occupancyPercent >= 70
                              ? "text-amber-500"
                              : "text-emerald-500"
                          }`}
                        >
                          {Math.round(occupancyPercent)}% filled
                        </span>
                      </div>
                    </div>

                    {/* Additional Info Row */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              occupancyPercent >= 90
                                ? "bg-rose-500"
                                : occupancyPercent >= 70
                                ? "bg-amber-500"
                                : "bg-emerald-500"
                            }`}
                          />
                          <span>
                            {occupancyPercent >= 90
                              ? "Near Capacity"
                              : occupancyPercent >= 70
                              ? "Moderate Load"
                              : "Available Space"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ChevronRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                          <span className="group-hover:text-slate-700 transition-colors">
                            Details
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
