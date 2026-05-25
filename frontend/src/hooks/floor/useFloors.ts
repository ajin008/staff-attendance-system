import { getErrorMessage } from "@/src/utils/axios";
// src/hooks/useFloors.ts
import useSWR from "swr";
import {
  getAllFloors,
  createFloor,
  updateFloor,
  deleteFloor,
  Floor,
  CreateFloorPayload,
  UpdateFloorPayload,
} from "../../services/floor.service";

import { toast } from "sonner";

const FLOORS_KEY = "/admin/floors";

export function useFloors() {
  const {
    data: floors,
    error,
    isLoading,
    mutate: mutateFloors,
  } = useSWR(FLOORS_KEY, getAllFloors, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
  });

  const addFloor = async (payload: CreateFloorPayload) => {
    try {
      await createFloor(payload);
      await mutateFloors(); // Refetch all floors
      toast.success("Floor added successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const editFloor = async (id: number, payload: UpdateFloorPayload) => {
    try {
      await updateFloor(id, payload);
      await mutateFloors(); // Refetch all floors
      toast.success("Floor updated successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  const removeFloor = async (id: number) => {
    try {
      await deleteFloor(id);
      await mutateFloors(); // Refetch all floors
      toast.success("Floor deleted successfully");
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    }
  };

  return {
    floors: floors || [],
    isLoading,
    error,
    addFloor,
    editFloor,
    removeFloor,
    refreshFloors: mutateFloors,
  };
}
