// src/components/staff/CheckInOutButton.tsx
"use client";

import { Loader2, CheckCircle, Clock, LogOut, MapPin } from "lucide-react";
import { useAttendance } from "@/src/hooks/useAttendance";

interface CheckInOutButtonProps {
  className?: string;
}

export const CheckInOutButton = ({ className = "" }: CheckInOutButtonProps) => {
  const {
    isCheckedIn,
    isCheckedOut,
    checkInTime,
    checkOutTime,
    isLoading,
    isLocating,
    checkIn,
    checkOut,
  } = useAttendance();

  const formatTime = (timeString?: string) => {
    if (!timeString) return "";
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // If already checked out
  if (isCheckedOut) {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
            <CheckCircle className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Today&apos;s Shift
            </p>
            <p className="text-sm font-medium text-slate-600">Completed</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-slate-400">Check In</span>
            <span className="font-mono text-slate-600">
              {formatTime(checkInTime)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">Check Out</span>
            <span className="font-mono text-slate-600">
              {formatTime(checkOutTime)}
            </span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] font-mono text-slate-400">
              Shift complete
            </span>
          </div>
        </div>
      </div>
    );
  }

  // If checked in (waiting for check out)
  if (isCheckedIn) {
    return (
      <div
        className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Currently Working
            </p>
            <p className="text-sm font-medium text-emerald-600">Active Shift</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="flex justify-between items-center py-2 border-b border-slate-50">
            <span className="text-slate-400 text-sm">Checked in at</span>
            <span className="font-mono text-sm text-slate-600">
              {formatTime(checkInTime)}
            </span>
          </div>
        </div>

        <button
          onClick={checkOut}
          disabled={isLoading || isLocating}
          className="w-full py-3 rounded-xl text-sm font-medium
                     bg-slate-900 hover:bg-slate-800 text-white
                     transition-all duration-200
                     flex items-center justify-center gap-2
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocating ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting location...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4" />
              Check Out
            </>
          )}
        </button>
      </div>
    );
  }

  // Default state (not checked in)
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-100 p-6 ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center">
          <Clock className="h-5 w-5 text-slate-400" />
        </div>
        <div>
          <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            Shift Status
          </p>
          <p className="text-sm font-medium text-slate-600">Not started</p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-5 font-mono">
        Ready to start your workday?
      </p>

      <button
        onClick={checkIn}
        disabled={isLoading || isLocating}
        className="w-full py-3 rounded-xl text-sm font-medium
                   bg-emerald-500 hover:bg-emerald-600 text-white
                   transition-all duration-200
                   flex items-center justify-center gap-2
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLocating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Getting location...
          </>
        ) : isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <MapPin className="h-4 w-4" />
            Check In with Location
          </>
        )}
      </button>

      <p className="text-[10px] text-slate-300 text-center mt-4 font-mono">
        Location access required for verification
      </p>
    </div>
  );
};
