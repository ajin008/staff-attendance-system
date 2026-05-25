// src/hooks/floor/useAvailableStaff.ts
import useSWR from "swr";
import { getAvailableStaff } from "../../services/floor.service";
import type { Staff } from "../../services/floor.service";

const getAvailableStaffKey = (floorId: number) =>
  `/admin/floors/${floorId}/available-staff`;

export function useAvailableStaff(floorId: number) {
  const { data, error, isLoading, mutate } = useSWR(
    getAvailableStaffKey(floorId),
    () => getAvailableStaff(floorId),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000,
    }
  );

  return {
    availableStaff: data || [],
    isLoading,
    error,
    refreshAvailableStaff: mutate,
  };
}
