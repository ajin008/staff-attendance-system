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
        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
      {/* Left Column Matrix Node: Available Unassigned Staff */}
      <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
        <div className="p-4 border-b border-slate-200/60 bg-white">
          <div className="flex items-center gap-2">
            <Users className="h-3.5 w-3.5 text-slate-900" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
              Available Pool
            </h3>
            <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm ml-auto">
              {availableStaff.length} Nodes
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
            Personnel unassigned to any operational infrastructure floors.
          </p>
        </div>

        <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
          {availableStaff.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-xs font-medium text-slate-400">
                No unassigned staff discovered
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                All staff elements are distributed into floor sectors.
              </p>
            </div>
          ) : (
            availableStaff.map((staff) => (
              <div
                key={staff.id}
                className="p-3.5 hover:bg-slate-50/50 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-xs font-bold text-slate-900 group-hover:text-black transition-colors">
                    {staff.name}
                  </p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                    {staff.staffId}
                  </p>
                </div>
                <button
                  onClick={() => handleAssign(staff.id)}
                  disabled={
                    assigningStaffId === staff.id ||
                    heatMapData.occupiedCount >= maxCapacity
                  }
                  className="p-1.5 rounded-md text-slate-400 border border-transparent hover:border-slate-200 hover:text-emerald-600 hover:bg-emerald-50/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
                  title="Provision assignment to floor grid"
                >
                  {assigningStaffId === staff.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column Grid Group: Active Distribution & Spatial Heat Map */}
      <div className="space-y-6">
        {/* Active Deployment Segment List */}
        <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
          <div className="p-4 border-b border-slate-200/60 bg-white">
            <div className="flex items-center gap-2">
              <UserCheck className="h-3.5 w-3.5 text-slate-900" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Assigned Roster
              </h3>
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm ml-auto">
                {assignedStaff.length} / {maxCapacity} Bounds
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
              Active operational elements committed to this floor plan layout.
            </p>
          </div>

          <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
            {assignedStaff.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Grid sector currently empty
                </p>
                <p className="text-[10px] text-slate-300 mt-0.5">
                  Initialize a node assignment by matching coordinates.
                </p>
              </div>
            ) : (
              assignedStaff.map((staff) => (
                <div
                  key={staff.id}
                  className="p-3.5 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {staff.name}
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                      {staff.staffId}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(staff.id)}
                    disabled={removingStaffId === staff.id}
                    className="p-1.5 rounded-md text-slate-400 border border-transparent hover:border-slate-200 hover:text-rose-600 hover:bg-rose-50/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
                    title="Terminate floor allocation"
                  >
                    {removingStaffId === staff.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dense Spatial Matrix Array Map Grid */}
        <div className="bg-white rounded-md border border-slate-200/70 p-4 space-y-4">
          <div className="flex items-start justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-tight">
                Capacity Node Map
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-normal">
                Structured layout monitoring load density metrics.
              </p>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold text-slate-900 font-mono tracking-tight">
                {heatMapData.occupiedCount}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                {" "}
                / {maxCapacity} Nodes Allocated
              </span>
            </div>
          </div>

          {/* Map Vector Grid Array Matrix */}
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {heatMapData.seats.map((seat, index) => (
              <div
                key={index}
                className={`
                  aspect-square rounded-sm transition-all duration-150 cursor-crosshair relative group border
                  ${
                    seat.isOccupied
                      ? "bg-slate-900 border-slate-950"
                      : "bg-slate-50 border-slate-200/80 hover:bg-slate-100/80"
                  }
                `}
                title={`Coordinate Index Node ${index + 1}: ${
                  seat.isOccupied ? "Occupied" : "Vacant"
                }`}
              >
                <div className="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div
                    className={`w-1 h-1 rounded-full ${
                      seat.isOccupied ? "bg-white/40" : "bg-slate-400"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Capacity Vector Track Analytics Progress Metrics */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 font-mono">
              <span>Occupancy Matrix Load</span>
              <span className="font-bold text-slate-900">
                {Math.round((heatMapData.occupiedCount / maxCapacity) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-1 overflow-hidden">
              <div
                className="bg-slate-900 h-1 rounded-xs transition-all duration-300"
                style={{
                  width: `${(heatMapData.occupiedCount / maxCapacity) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Structural Node Map Legend */}
          <div className="flex items-center gap-3 pt-2 text-[10px] font-mono text-slate-400 border-t border-slate-100">
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-50 border border-slate-200" />
              <span>[ Vacant Node Slot ]</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-slate-900 border border-slate-950" />
              <span>[ Occupied Core Sector ]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
