"use client";

import { useState } from "react";
import { useAttendance } from "@/src/hooks/useAttendance";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Type } from "lucide-react";
import CheckOutModal from "./CheckOutModal";
import { Mood } from "@/src/types";

function formatTime(date: string | null) {
  if (!date) return "--:--";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMinutes(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

const moodDisplay: Record<Mood, { emoji: string; label: string }> = {
  tired: { emoji: "😴", label: "Tired" },
  okay: { emoji: "😐", label: "Okay" },
  good: { emoji: "🙂", label: "Good" },
  happy: { emoji: "😊", label: "Happy" },
  excited: { emoji: "🤩", label: "Excited" },
};

export default function AttendanceCard() {
  const { attendance, loading, actionLoading, handleCheckIn, handleCheckOut } =
    useAttendance();
  const [checkOutModalOpen, setCheckOutModalOpen] = useState(false);

  const onCheckIn = async () => {
    try {
      await handleCheckIn();
      toast.success("Checked in successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to check in";
      toast.error(msg);
    }
  };

  const handleCheckOutConfirm = async (mood: Mood) => {
    await handleCheckOut(mood);
    setCheckOutModalOpen(false);
    toast.success("Checked out! Have a great evening 👋");
  };

  if (loading) {
    return (
      <div
        className="bg-white rounded-2xl border border-slate-100 p-8
                      flex items-center justify-center"
      >
        <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
      </div>
    );
  }

  const hasCheckedIn = !!attendance?.checkIn;
  const hasCheckedOut = !!attendance?.checkOut;
  const isComplete = hasCheckedIn && hasCheckedOut;
  const mood = attendance?.mood as Mood | null | undefined;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main action card */}
        <div
          className="md:col-span-2 bg-white rounded-2xl border
                        border-slate-100 p-8"
        >
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-6">
            02 — Today
          </p>

          {/* Status */}
          <div className="mb-8">
            {isComplete ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span
                  className="text-xs font-semibold text-emerald-600
                                 uppercase tracking-wider"
                >
                  Day Complete
                </span>
              </div>
            ) : hasCheckedIn ? (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span
                  className="text-xs font-semibold text-blue-600
                                 uppercase tracking-wider"
                >
                  Currently Working
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span
                  className="text-xs font-semibold text-slate-400
                                 uppercase tracking-wider"
                >
                  Not Started
                </span>
              </div>
            )}

            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isComplete
                ? "See you tomorrow!"
                : hasCheckedIn
                ? "You're clocked in"
                : "Ready to start?"}
            </h2>
          </div>

          {/* Times */}
          <div className="flex gap-8 mb-10">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                Check In
              </p>
              <p
                className={`text-2xl font-bold tracking-tight
                            ${
                              hasCheckedIn ? "text-slate-900" : "text-slate-200"
                            }`}
              >
                {formatTime(attendance?.checkIn ?? null)}
              </p>
            </div>
            <div className="w-px bg-slate-100" />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                Check Out
              </p>
              <p
                className={`text-2xl font-bold tracking-tight
                            ${
                              hasCheckedOut
                                ? "text-slate-900"
                                : "text-slate-200"
                            }`}
              >
                {formatTime(attendance?.checkOut ?? null)}
              </p>
            </div>
            {isComplete && attendance?.workMinutes ? (
              <>
                <div className="w-px bg-slate-100" />
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                    Duration
                  </p>
                  <p className="text-2xl font-bold text-slate-900 tracking-tight">
                    {formatMinutes(attendance.workMinutes)}
                  </p>
                </div>
              </>
            ) : null}
          </div>

          {/* Mood display after checkout */}
          {isComplete && mood && (
            <div
              className="flex items-center gap-2 mb-6 px-4 py-3
                            bg-slate-50 rounded-xl w-fit"
            >
              <span className="text-xl">{moodDisplay[mood].emoji}</span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest">
                  Today's mood
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {moodDisplay[mood].label}
                </p>
              </div>
            </div>
          )}

          {/* Action Button */}
          {!isComplete && (
            <button
              onClick={
                hasCheckedIn ? () => setCheckOutModalOpen(true) : onCheckIn
              }
              disabled={actionLoading}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl
                          text-sm font-semibold transition-all duration-150
                          disabled:opacity-50 disabled:cursor-not-allowed
                          ${
                            hasCheckedIn
                              ? "bg-slate-900 hover:bg-slate-700 text-white"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white"
                          }`}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : hasCheckedIn ? (
                "Check Out →"
              ) : (
                "Check In →"
              )}
            </button>
          )}
        </div>

        {/* Side info card */}
        <div
          className="bg-white rounded-2xl border border-slate-100 p-6
                        flex flex-col justify-between"
        >
          <div>
            <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
              Today's Date
            </p>
            <p className="text-4xl font-bold text-slate-900 leading-none">
              {new Date().getDate()}
            </p>
            <p className="text-sm text-slate-400 mt-1">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100">
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-3">
              Status
            </p>
            <span
              className={`px-3 py-1.5 rounded-full text-xs font-semibold
              ${
                isComplete
                  ? "bg-emerald-50 text-emerald-700"
                  : hasCheckedIn
                  ? "bg-blue-50 text-blue-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {isComplete ? "Present" : hasCheckedIn ? "Incomplete" : "Absent"}
            </span>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckOutModal
        open={checkOutModalOpen}
        onClose={() => setCheckOutModalOpen(false)}
        onConfirm={handleCheckOutConfirm}
      />
    </>
  );
}
