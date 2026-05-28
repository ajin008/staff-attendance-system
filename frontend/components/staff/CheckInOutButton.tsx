// src/components/staff/CheckInOutButton.tsx
"use client";

import {
  Loader2,
  CheckCircle,
  Clock,
  LogOut,
  MapPin,
  Building2,
  AlertCircle,
} from "lucide-react";
import { useAttendance } from "@/src/hooks/useAttendance";
import CheckOutModal from "./CheckOutModal";

interface CheckInOutButtonProps {
  className?: string;
}

export const CheckInOutButton = ({ className = "" }: CheckInOutButtonProps) => {
  const {
    isCheckedIn,
    isCheckedOut,
    currentAttendance,
    isLoading,
    isLocating,
    isInitialLoading,
    showCheckOutModal,
    checkIn,
    openCheckOutModal,
    closeCheckOutModal,
    checkOut,
  } = useAttendance();

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLateMinutes = (minutes?: number) => {
    if (!minutes || minutes <= 0) return null;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  // State A: Loading Profile Metadata
  if (isInitialLoading) {
    return (
      <div className={`p-5 bg-white ${className}`}>
        <div className="flex items-center justify-center gap-2.5 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
          <span className="text-xs font-medium text-slate-500">
            Syncing registry status...
          </span>
        </div>
      </div>
    );
  }

  // State B: Shift Completed
  if (isCheckedOut && currentAttendance?.checkOutTime) {
    return (
      <div className={`p-5 bg-white ${className}`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
              <CheckCircle className="h-3.5 w-3.5 stroke-[2]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Shift Allocation
              </span>
              <p className="text-xs font-bold text-slate-800">
                Completed Cycle
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
            Archived
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
            <span className="text-slate-400 text-[11px]">Check-In Mark</span>
            <span className="font-mono text-slate-700">
              {formatTime(currentAttendance?.checkInTime)}
            </span>
          </div>
          <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
            <span className="text-slate-400 text-[11px]">Check-Out Mark</span>
            <span className="font-mono text-slate-700">
              {formatTime(currentAttendance?.checkOutTime)}
            </span>
          </div>

          {currentAttendance?.shiftStart && currentAttendance?.shiftEnd && (
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
              <span className="text-slate-400 text-[11px]">Assigned Range</span>
              <span className="text-slate-600 font-mono text-[11px]">
                {currentAttendance.shiftStart} - {currentAttendance.shiftEnd}
              </span>
            </div>
          )}

          {currentAttendance?.branch && (
            <div className="flex justify-between items-center pt-1 font-medium">
              <span className="text-slate-400 text-[11px]">Validated Node</span>
              <span className="inline-flex items-center gap-1.5 text-slate-700">
                <Building2 className="h-3.5 w-3.5 text-slate-300" />
                {currentAttendance.branch.name}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // State C: Active Shift (Checked In)
  if (isCheckedIn && currentAttendance?.checkInTime) {
    const lateText = formatLateMinutes(currentAttendance?.lateMinutes);

    return (
      <>
        <div className={`p-5 bg-white ${className}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-emerald-50/60 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Clock className="h-3.5 w-3.5 stroke-[2]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Terminal Gateway
                </span>
                <p className="text-xs font-bold text-emerald-600">
                  Active Duty
                </p>
              </div>
            </div>
            <span className="inline-flex items-center animate-pulse h-2 w-2 rounded-full bg-emerald-500" />
          </div>

          <div className="space-y-2.5 text-xs mb-4">
            <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
              <span className="text-slate-400 text-[11px]">Clocked-In</span>
              <span className="font-mono text-slate-700">
                {formatTime(currentAttendance?.checkInTime)}
              </span>
            </div>

            {currentAttendance?.isLate && lateText && (
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
                <span className="text-slate-400 text-[11px]">
                  Compliance Status
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide">
                  <AlertCircle className="h-3 w-3 stroke-[2.5]" />
                  Late +{lateText}
                </span>
              </div>
            )}

            {currentAttendance?.shiftStart && currentAttendance?.shiftEnd && (
              <div className="flex justify-between items-center py-1.5 border-b border-slate-100 font-medium">
                <span className="text-slate-400 text-[11px]">
                  Configured window
                </span>
                <span className="text-slate-600 font-mono text-[11px]">
                  {currentAttendance.shiftStart} - {currentAttendance.shiftEnd}
                </span>
              </div>
            )}

            {currentAttendance?.branch && (
              <div className="flex justify-between items-center pt-1 font-medium">
                <span className="text-slate-400 text-[11px]">
                  Authorized Zone
                </span>
                <span className="inline-flex items-center gap-1.5 text-slate-700">
                  <Building2 className="h-3.5 w-3.5 text-slate-300" />
                  {currentAttendance.branch.name}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={openCheckOutModal}
            disabled={isLoading || isLocating}
            className="w-full py-2 text-xs font-bold uppercase tracking-wider
                       bg-[#0F0F11] hover:bg-black text-white rounded transition-colors 
                       flex items-center justify-center gap-2 focus:outline-none shadow-xs
                       disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {isLoading || isLocating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                <span>Processing Matrix...</span>
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Terminate Duty Shift</span>
              </>
            )}
          </button>
        </div>

        <CheckOutModal
          open={showCheckOutModal}
          onClose={closeCheckOutModal}
          onConfirm={async (latitude, longitude) => {
            await checkOut(latitude, longitude);
          }}
          isLocating={isLocating}
        />
      </>
    );
  }

  // State D: Inactive / Not Checked In yet
  return (
    <div className={`p-5 bg-white ${className}`}>
      <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3.5 mb-4">
        <div className="w-7 h-7 rounded bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
          <Clock className="h-3.5 w-3.5 stroke-[2]" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            System State
          </span>
          <p className="text-xs font-bold text-slate-800">Awaiting Log</p>
        </div>
      </div>

      <p className="text-[11px] text-slate-500 mb-4 leading-relaxed font-medium">
        Ready to start your work hours? Ensure your physical device matches your
        designated office coordinates before verification.
      </p>

      <button
        onClick={checkIn}
        disabled={isLoading || isLocating}
        className="w-full py-2 text-xs font-bold uppercase tracking-wider
                   bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors 
                   flex items-center justify-center gap-2 focus:outline-none shadow-xs
                   disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {isLocating ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Parsing Geofence...</span>
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>Validating...</span>
          </>
        ) : (
          <>
            <MapPin className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Evaluate Geofence & Check In</span>
          </>
        )}
      </button>

      <p className="text-[10px] font-medium text-slate-400 text-center mt-2.5">
        * GPS tracking authorization protocol mandatory.
      </p>
    </div>
  );
};
