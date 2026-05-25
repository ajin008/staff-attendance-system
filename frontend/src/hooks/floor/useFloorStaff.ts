import type { Staff } from "./../../types/index";
// src/hooks/floor/useFloorStaff.ts
import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  getFloorStaff,
  assignStaffToFloor,
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
    if (assignedStaff) {
      const occupiedSeats = assignedStaff.map((_, index) => index);
      const newSeats = Array.from({ length: maxCapacity }, (_, i) => ({
        id: i,
        isOccupied: occupiedSeats.includes(i),
      }));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeatMapData({
        seats: newSeats,
        occupiedCount: assignedStaff.length,
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
      { id: staffId, staffId: `ST-${staffId}`, name: "Loading..." }, // Temporary placeholder
    ];
    mutate(optimisticStaff, false);

    try {
      const response = await assignStaffToFloor(floorId, staffId);
      // Refresh data from server
      await mutate();
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

  return {
    assignedStaff: assignedStaff || [],
    isLoading,
    error,
    heatMapData,
    assignToFloor,
    refreshStaff: mutate,
  };
}
