// src/services/floor.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface Branch {
  id: number;
  name: string;
}

export interface Floor {
  id: number;
  name: string;
  maxCapacity: number;
  branchId: number;
  isActive: boolean;
  branch?: Branch;
  currentStaffCount?: number;
  availableSlots?: number;
  isFull?: boolean;
  staff?: Staff[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Staff {
  id: number;
  staffId: string;
  name: string;
  checkInTime?: string;
}

export interface CreateFloorPayload {
  name: string;
  maxCapacity: number;
  branchId: number;
}

export interface UpdateFloorPayload {
  name?: string;
  maxCapacity?: number;
  branchId?: number;
}

export interface GetAllFloorsResponse {
  message: string;
  floors: Floor[];
}

export interface CreateFloorResponse {
  message: string;
  floor: Floor;
}

// Get all floors
export const getAllFloors = async (): Promise<Floor[]> => {
  //   console.log("Fetching all floors...");
  const response = await api.get<GetAllFloorsResponse>(ENDPOINT.GET_ALL_FLOORS);
  //   console.log("Received floors data:", response.data.floors);
  return response.data.floors;
};

// Create new floor
export const createFloor = async (
  payload: CreateFloorPayload
): Promise<Floor> => {
  console.log("Creating floor with payload:", payload);
  const response = await api.post<CreateFloorResponse>(
    ENDPOINT.CREATE_FLOOR,
    payload
  );
  return response.data.floor;
};

// Update floor
export const updateFloor = async (
  id: number,
  payload: UpdateFloorPayload
): Promise<Floor> => {
  console.log(`Updating floor ${id} with payload:`, payload);
  const response = await api.patch<CreateFloorResponse>(
    ENDPOINT.UPDATE_FLOOR(id),
    payload
  );
  return response.data.floor;
};

// Delete floor
export const deleteFloor = async (id: number): Promise<void> => {
  await api.delete(ENDPOINT.DELETE_FLOOR(id));
};

// Get available staff (not assigned to any floor)
export const getAvailableStaff = async (floorId: number): Promise<Staff[]> => {
  const response = await api.get(ENDPOINT.GET_AVAILABLE_STAFF(floorId));
  return response.data.staff || response.data;
};

// Get staff assigned to a specific floor
export const getFloorStaff = async (floorId: number): Promise<Staff[]> => {
  const response = await api.get(ENDPOINT.GET_FLOOR_STAFF(floorId));
  return response.data.staff || response.data;
};

// Assign staff to floor
export const assignStaffToFloor = async (
  floorId: number,
  staffId: number
): Promise<{ message: string }> => {
  const response = await api.post(ENDPOINT.ASSIGN_STAFF_TO_FLOOR(floorId), {
    staffId,
  });
  return response.data;
};
