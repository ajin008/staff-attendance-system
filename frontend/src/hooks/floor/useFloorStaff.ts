// src/hooks/floor/useFloorStaff.ts
import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  getFloorStaff,
  assignStaffToFloor,
  removeStaffFromFloor,
} from "../../services/floor.service";
import { toast } from "sonner";

const getFloorStaffKey = (floorId: number) => `/admin/floors/${floorId}/staff`;

interface Seat {
  id: number;
  isOccupied: boolean;
}

interface HeatMapData {
  seats: Seat[];
  occupiedCount: number;
}

export function useFloorStaff(floorId: number, maxCapacity: number) {
  const [heatMapData, setHeatMapData] = useState<HeatMapData>({
    seats: Array.from({ length: maxCapacity }, (_, i) => ({
      id: i,
      isOccupied: false,
    })),
    occupiedCount: 0,
  });

  const {
    data: assignedStaff,
    error,
    isLoading,
    mutate,
  } = useSWR(getFloorStaffKey(floorId), () => getFloorStaff(floorId), {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 30000,
  });

  // Update heat map when assigned staff changes
  useEffect(() => {
    if (assignedStaff && Array.isArray(assignedStaff)) {
      const occupiedCount = assignedStaff.length;
      const newSeats = Array.from({ length: maxCapacity }, (_, i) => ({
        id: i,
        isOccupied: i < occupiedCount,
      }));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeatMapData({
        seats: newSeats,
        occupiedCount: occupiedCount,
      });
    }
  }, [assignedStaff, maxCapacity]);

  const assignToFloor = async (staffId: number) => {
    // Find the first available seat
    const availableSeatIndex = heatMapData.seats.findIndex(
      (seat) => !seat.isOccupied
    );

    if (availableSeatIndex === -1) {
      toast.error("Floor is at full capacity");
      return;
    }

    // Optimistic update - immediately update heat map
    const optimisticSeats = [...heatMapData.seats];
    optimisticSeats[availableSeatIndex] = {
      ...optimisticSeats[availableSeatIndex],
      isOccupied: true,
    };

    setHeatMapData({
      seats: optimisticSeats,
      occupiedCount: heatMapData.occupiedCount + 1,
    });

    // Also update the assigned staff list optimistically
    const optimisticStaff = [
      ...(assignedStaff || []),
      { id: staffId, staffId: `ST-${staffId}`, name: "Loading..." },
    ];
    mutate(optimisticStaff, false);

    try {
      await assignStaffToFloor(floorId, staffId);
      await mutate(); // Refresh data from server
      toast.success("Staff assigned successfully");
    } catch (error) {
      // Revert optimistic updates on error
      setHeatMapData({
        seats: heatMapData.seats,
        occupiedCount: heatMapData.occupiedCount,
      });
      await mutate();
      toast.error("Failed to assign staff");
      throw error;
    }
  };

  const removeFromFloor = async (staffId: number) => {
    // Find which seat this staff occupies based on their position in the array
    const staffIndex = (assignedStaff || []).findIndex((s) => s.id === staffId);

    if (staffIndex === -1) {
      toast.error("Staff not found on this floor");
      return;
    }

    // Optimistic update - remove from heat map
    const optimisticSeats = [...heatMapData.seats];
    optimisticSeats[staffIndex] = {
      ...optimisticSeats[staffIndex],
      isOccupied: false,
    };

    // Shift remaining seats to maintain order
    const reorderedSeats = [...optimisticSeats];
    const occupiedSeats = reorderedSeats.filter((seat) => seat.isOccupied);
    const emptySeats = reorderedSeats.filter((seat) => !seat.isOccupied);
    const newSeats = [...occupiedSeats, ...emptySeats];

    setHeatMapData({
      seats: newSeats,
      occupiedCount: heatMapData.occupiedCount - 1,
    });

    // Optimistic update - remove from assigned staff list
    const optimisticStaff = (assignedStaff || []).filter(
      (s) => s.id !== staffId
    );
    mutate(optimisticStaff, false);

    try {
      await removeStaffFromFloor(floorId, staffId);
      await mutate(); // Refresh data from server
      toast.success("Staff removed successfully");
    } catch (error) {
      // Revert on error
      setHeatMapData({
        seats: heatMapData.seats,
        occupiedCount: heatMapData.occupiedCount,
      });
      await mutate();
      toast.error("Failed to remove staff");
      throw error;
    }
  };

  return {
    assignedStaff: assignedStaff || [],
    isLoading,
    error,
    heatMapData,
    assignToFloor,
    removeFromFloor,
    refreshStaff: mutate,
  };
}
