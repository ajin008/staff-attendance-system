// components/admin/FloorMap.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Users, Building2 } from "lucide-react";
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-slate-400">Loading floors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">
          Error loading floors. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-light tracking-tight text-slate-800">
            Floor Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your office floors and staff allocation
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Floor
        </button>
      </div>

      {/* Floor Grid */}
      {floors.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-slate-100">
          <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">No floors added yet</p>
          <button
            onClick={openAddModal}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700"
          >
            + Add your first floor
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {floors.map((floor) => (
            <div
              key={floor.id}
              onClick={() => handleCardClick(floor.id)}
              className="group relative bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all cursor-pointer"
            >
              {/* Edit/Delete Buttons */}
              <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(floor);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Edit Floor"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openDeleteModal(floor);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete Floor"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Floor Info */}
              <div className="pr-16">
                <h3 className="font-medium text-slate-800 mb-1">
                  {floor.name}
                </h3>
                {floor.branch && (
                  <div className="flex items-center gap-1 mb-3">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    <span className="text-xs text-slate-400">
                      {floor.branch.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    <span className="font-medium">
                      {floor.currentStaffCount || 0}
                    </span>
                    <span className="text-slate-400">
                      {" "}
                      / {floor.maxCapacity}
                    </span>
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  {floor.isFull
                    ? "Full"
                    : `${floor.availableSlots || floor.maxCapacity} slots left`}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all"
                  style={{
                    width: `${
                      ((floor.currentStaffCount || 0) / floor.maxCapacity) * 100
                    }%`,
                  }}
                />
              </div>
            </div>
          ))}
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
