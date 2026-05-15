"use client";

import { useEffect, useState } from "react";
import { getAttendanceHeatmap } from "@/src/services/attendance.service";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const statusColor: Record<string, string> = {
  present: "bg-emerald-500",
  incomplete: "bg-blue-400",
  absent: "bg-red-300",
};

const statusLabel: Record<string, string> = {
  present: "Present",
  incomplete: "Incomplete",
  absent: "Absent",
};

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month - 1, 1).getDay();
}

function toDateKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0"
  )}`;
}

export default function AttendanceHeatmap() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [data, setData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAttendanceHeatmap(month, year)
      .then(setData)
      .catch(() => setData({}))
      .finally(() => setLoading(false));
  }, [month, year]);

  const prevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const nextMonth = () => {
    const isCurrentMonth =
      month === now.getMonth() + 1 && year === now.getFullYear();
    if (isCurrentMonth) return;
    if (month === 12) {
      setMonth(1);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const isCurrentMonth =
    month === now.getMonth() + 1 && year === now.getFullYear();

  const daysInMonth = getDaysInMonth(month, year);
  const firstDayOfMonth = getFirstDayOfMonth(month, year);
  const today = toDateKey(now.getFullYear(), now.getMonth() + 1, now.getDate());

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 mt-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-0.5">
            03 — History
          </p>
          <h2 className="text-base font-semibold text-slate-900">
            Monthly Attendance
          </h2>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700
                       hover:bg-slate-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-slate-700 w-32 text-center">
            {MONTHS[month - 1]} {year}
          </span>
          <button
            onClick={nextMonth}
            disabled={isCurrentMonth}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700
                       hover:bg-slate-100 transition-colors
                       disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
        </div>
      ) : (
        <>
          {/* Day labels */}
          <div className="grid grid-cols-7 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-slate-400 py-1"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for first week */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const key = toDateKey(year, month, day);
              const status = data[key];
              const isToday = key === today;
              const isFuture = new Date(year, month - 1, day) > now;

              return (
                <div
                  key={day}
                  title={status ? statusLabel[status] : "No record"}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center
                    text-xs font-medium transition-all
                    ${
                      isFuture
                        ? "text-slate-200"
                        : status
                        ? `${statusColor[status]} text-white`
                        : "bg-slate-100 text-slate-400"
                    }
                    ${isToday ? "ring-2 ring-offset-1 ring-slate-900" : ""}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div
            className="flex items-center gap-4 mt-4 pt-4
                          border-t border-slate-100"
          >
            {Object.entries(statusColor).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1.5">
                <div className={`w-3 h-3 rounded-sm ${color}`} />
                <span className="text-xs text-slate-400 capitalize">
                  {status}
                </span>
              </div>
            ))}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-slate-100" />
              <span className="text-xs text-slate-400">No record</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
