// components/floor/FloorStaffSection.tsx
"use client";

import { useState } from "react";
import { Users, Plus, X, Loader2, UserCheck } from "lucide-react";
import { useAvailableStaff } from "@/src/hooks/floor/useAvailableStaff";
import { useFloorStaff } from "@/src/hooks/floor/useFloorStaff";

interface FloorStaffSectionProps {
  floorId: number;
  maxCapacity: number;
}

export default function FloorStaffSection({
  floorId,
  maxCapacity,
}: FloorStaffSectionProps) {
  const [assigningStaffId, setAssigningStaffId] = useState<number | null>(null);
  const [removingStaffId, setRemovingStaffId] = useState<number | null>(null);

  const {
    availableStaff,
    isLoading: isLoadingStaff,
    refreshAvailableStaff,
  } = useAvailableStaff(floorId);
  const {
    assignedStaff,
    isLoading: isLoadingAssigned,
    heatMapData,
    assignToFloor,
    removeFromFloor,
  } = useFloorStaff(floorId, maxCapacity);

  const handleAssign = async (staffId: number) => {
    setAssigningStaffId(staffId);
    try {
      await assignToFloor(staffId);
      await refreshAvailableStaff();
    } finally {
      setAssigningStaffId(null);
    }
  };

  const handleRemove = async (staffId: number) => {
    setRemovingStaffId(staffId);
    try {
      await removeFromFloor(staffId);
      await refreshAvailableStaff();
    } finally {
      setRemovingStaffId(null);
    }
  };

  if (isLoadingStaff || isLoadingAssigned) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left Side - Active Staff List (Available to Assign) */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium text-slate-700">Available Staff</h3>
            <span className="text-xs text-slate-400 ml-auto">
              {availableStaff.length} staff available
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Staff not assigned to any floor
          </p>
        </div>
        <div className="divide-y divide-slate-50 max-h-[500px] overflow-y-auto">
          {availableStaff.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">No staff available</p>
              <p className="text-xs text-slate-300 mt-1">
                All staff are already assigned to floors
              </p>
            </div>
          ) : (
            availableStaff.map((staff) => (
              <div
                key={staff.id}
                className="p-4 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {staff.name}
                    </p>
                    <p className="text-xs font-mono text-slate-400">
                      {staff.staffId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAssign(staff.id)}
                    disabled={
                      assigningStaffId === staff.id ||
                      heatMapData.occupiedCount >= maxCapacity
                    }
                    className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Assign to floor"
                  >
                    {assigningStaffId === staff.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Side - Assigned Staff & Heat Map */}
      <div className="space-y-6">
        {/* Assigned Staff List */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              <h3 className="font-medium text-slate-700">Assigned Staff</h3>
              <span className="text-xs text-slate-400 ml-auto">
                {assignedStaff.length} / {maxCapacity} assigned
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Staff currently working on this floor
            </p>
          </div>
          <div className="divide-y divide-slate-50 max-h-[300px] overflow-y-auto">
            {assignedStaff.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No staff assigned</p>
                <p className="text-xs text-slate-300 mt-1">
                  Click + on available staff to assign
                </p>
              </div>
            ) : (
              assignedStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="p-4 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {staff.name}
                      </p>
                      <p className="text-xs font-mono text-slate-400">
                        {staff.staffId}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(staff.id)}
                      disabled={removingStaffId === staff.id}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Remove from floor"
                    >
                      {removingStaffId === staff.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Heat Map (GitHub Style) */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="mb-4">
            <h3 className="font-medium text-slate-700 mb-1">Floor Occupancy</h3>
            <p className="text-xs text-slate-400">
              {heatMapData.occupiedCount} of {maxCapacity} seats occupied
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
            <div className="w-4 h-4 rounded bg-emerald-100" />
            <span className="text-xs text-slate-500">Available</span>
            <div className="w-4 h-4 rounded bg-emerald-500 ml-2" />
            <span className="text-xs text-slate-500">Occupied</span>
          </div>

          {/* Heat Grid - GitHub Style */}
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {heatMapData.seats.map((seat, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-md transition-all duration-300 cursor-help
                  ${
                    seat.isOccupied
                      ? "bg-emerald-500 scale-100"
                      : "bg-emerald-100 scale-95 hover:scale-100"
                  }
                  ${!seat.isOccupied && "hover:bg-emerald-200"}
                `}
                title={`Seat ${index + 1} - ${
                  seat.isOccupied ? "Occupied" : "Available"
                }`}
              >
                <div className="w-full h-full rounded-md opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/50" />
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Occupancy Rate</span>
              <span className="font-medium text-slate-700">
                {Math.round((heatMapData.occupiedCount / maxCapacity) * 100)}%
              </span>
            </div>
            <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
              <div
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${(heatMapData.occupiedCount / maxCapacity) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
