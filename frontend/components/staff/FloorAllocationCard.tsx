// components/staff/FloorAllocationCard.tsx
"use client";

import { Building2, MapPin, Calendar, Info, Loader2 } from "lucide-react";
import { useStaffFloorAllocation } from "@/src/hooks/staff/useStaffFloorAllocation";

export default function FloorAllocationCard() {
  const { isAssigned, allocation, isLoading, error, refreshAllocation } =
    useStaffFloorAllocation();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          <span className="ml-2 text-sm text-slate-500">
            Loading allocation details...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="text-center py-6">
          <Info className="h-10 w-10 text-rose-400 mx-auto mb-3" />
          <p className="text-sm text-rose-600 mb-2">
            Unable to load floor allocation
          </p>
          <button
            onClick={refreshAllocation}
            className="text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (!isAssigned) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-xs">
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 mb-1">
            No Floor Assigned
          </h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You haven&#39;t been assigned to a floor yet. Please contact your
            administrator for workspace allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      {/* Header */}
      <div className="bg-emerald-50 px-5 py-3 border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
            Active Allocation
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Floor Info */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Building2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-mono">Assigned Floor</p>
            <h3 className="text-lg font-semibold text-slate-800">
              {allocation?.floor.name}
            </h3>
            {allocation?.floor.code && (
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Code: {allocation.floor.code}
              </p>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Branch */}
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Branch Location
              </p>
              <p className="text-sm font-medium text-slate-700">
                {allocation?.branch.name}
              </p>
            </div>
          </div>

          {/* Assigned Date */}
          <div className="flex items-start gap-2.5">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Assigned On
              </p>
              <p className="text-sm font-medium text-slate-700">
                {allocation && formatDate(allocation.assignedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Capacity Info */}
        {allocation?.floor.maxCapacity && (
          <div className="mt-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Floor Capacity</span>
              <span className="font-medium text-slate-700">
                {allocation.floor.maxCapacity} seats
              </span>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <button
          onClick={refreshAllocation}
          className="mt-2 text-[10px] font-mono text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
        >
          <span>↻</span>
          <span>refresh allocation status</span>
        </button>
      </div>
    </div>
  );
}
