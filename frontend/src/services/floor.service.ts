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
  organizationId?: number;
  code?: string | null;
  _count?: {
    staffAllocations?: number;
  };
}

export interface Staff {
  id: number;
  staffId: string;
  name: string;
  email?: string;
  phone?: string;
  checkInTime?: string;
  assignedAt?: string;
  assignedBy?: number;
  floorId?: number;
  branchId?: number;
  isActive?: boolean;
  checkedOutAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  userId?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attendance?: any[];
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
  const response = await api.get<GetAllFloorsResponse>(ENDPOINT.GET_ALL_FLOORS);
  console.log("Raw floors data from backend:", response.data.floors);

  // Transform the backend data to match frontend interface
  const transformedFloors = response.data.floors.map((floor: Floor) => ({
    id: floor.id,
    name: floor.name,
    maxCapacity: floor.maxCapacity,
    branchId: floor.branchId,
    isActive: floor.isActive,
    branch: floor.branch,
    createdAt: floor.createdAt,
    updatedAt: floor.updatedAt,
    organizationId: floor.organizationId,
    code: floor.code,
    // Transform _count to currentStaffCount
    currentStaffCount: floor._count?.staffAllocations || 0,
    availableSlots: floor.maxCapacity - (floor._count?.staffAllocations || 0),
    isFull: (floor._count?.staffAllocations || 0) >= floor.maxCapacity,
    staff: [], // Staff details are not included in list view, only in detail view
  }));

  console.log("Transformed floors data:", transformedFloors);
  return transformedFloors;
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
  console.log("getFloorStaff response:", response.data);

  if (response.data.staff && Array.isArray(response.data.staff)) {
    // Transform the data to extract user info into top-level properties
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedStaff = response.data.staff.map((item: any) => ({
      id: item.user?.id || item.id,
      staffId: item.user?.staffId || item.staffId,
      name: item.user?.name || item.name,
      email: item.user?.email || item.email,
      phone: item.user?.phone || item.phone,
      assignedAt: item.assignedAt,
      assignedBy: item.assignedBy,
      floorId: item.floorId,
      branchId: item.branchId,
      isActive: item.isActive,
      checkedOutAt: item.checkedOutAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      userId: item.userId,
      attendance: item.user?.attendance || [],
    }));

    console.log("🔄 Transformed staff data:", transformedStaff);
    return transformedStaff;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};

// Assign staff to floor
export const assignStaffToFloor = async (
  floorId: number,
  staffId: number
): Promise<{ message: string }> => {
  const response = await api.post(ENDPOINT.ASSIGN_STAFF_TO_FLOOR(floorId), {
    staffId,
  });
  console.log("assignStaffToFloor response:", response.data);
  return response.data;
};

export const removeStaffFromFloor = async (
  floorId: number,
  staffId: number
): Promise<{ message: string }> => {
  console.log(`Removing staff ${staffId} from floor ${floorId}...`);
  const response = await api.delete(
    ENDPOINT.REMOVE_STAFF_FROM_FLOOR(floorId, staffId)
  );
  return response.data;
};

export interface FloorAllocation {
  id: number;
  assignedAt: string;
  branch: {
    id: number;
    name: string;
  };
  floor: {
    id: number;
    name: string;
    code: string;
    maxCapacity: number;
  };
}

export interface StaffAllocationResponse {
  message: string;
  data: {
    assigned: boolean;
    allocation: FloorAllocation | null;
  };
}

export const getMyFloorAllocation =
  async (): Promise<StaffAllocationResponse> => {
    console.log("Fetching my floor allocation...");
    const response = await api.get<StaffAllocationResponse>(
      ENDPOINT.GET_MY_FLOOR_ALLOCATION
    );
    return response.data;
  };
