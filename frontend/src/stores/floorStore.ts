// src/stores/floorStore.ts
import { create } from "zustand";
import { Floor } from "../services/floor.service";

interface FloorUIState {
  selectedFloorId: number | null;
  isAddModalOpen: boolean;
  isEditModalOpen: boolean;
  isDeleteModalOpen: boolean;
  editingFloor: Floor | null;
  deletingFloor: Floor | null;

  // Actions
  setSelectedFloorId: (id: number | null) => void;
  openAddModal: () => void;
  closeAddModal: () => void;
  openEditModal: (floor: Floor) => void;
  closeEditModal: () => void;
  openDeleteModal: (floor: Floor) => void;
  closeDeleteModal: () => void;
}

export const useFloorUIStore = create<FloorUIState>((set) => ({
  selectedFloorId: null,
  isAddModalOpen: false,
  isEditModalOpen: false,
  isDeleteModalOpen: false,
  editingFloor: null,
  deletingFloor: null,

  setSelectedFloorId: (id) => set({ selectedFloorId: id }),
  openAddModal: () => set({ isAddModalOpen: true }),
  closeAddModal: () => set({ isAddModalOpen: false }),
  openEditModal: (floor) => set({ isEditModalOpen: true, editingFloor: floor }),
  closeEditModal: () => set({ isEditModalOpen: false, editingFloor: null }),
  openDeleteModal: (floor) =>
    set({ isDeleteModalOpen: true, deletingFloor: floor }),
  closeDeleteModal: () =>
    set({ isDeleteModalOpen: false, deletingFloor: null }),
}));
