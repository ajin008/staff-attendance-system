"use client";

import { useEffect, useState } from "react";
import { getTodayAllAttendance } from "@/src/services/attendance.service";
import { AttendanceRecord, PopulatedUser } from "@/src/types";
import { Loader2 } from "lucide-react";

function formatTime(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatMinutes(minutes: number) {
  if (!minutes) return "—";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

const statusStyles = {
  present: "bg-emerald-50 text-emerald-700",
  incomplete: "bg-blue-50 text-blue-700",
  absent: "bg-red-50 text-red-500",
};

interface Props {
  selectedDate: string;
}

const moodEmoji: Record<string, string> = {
  tired: "😴",
  okay: "😐",
  good: "🙂",
  happy: "😊",
  excited: "🤩",
};

export default function TodayAttendanceTable({ selectedDate }: Props) {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  console.log("records in today table", records);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setRecords([]);
    getTodayAllAttendance(selectedDate)
      .then(setRecords)
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const getUser = (record: AttendanceRecord): PopulatedUser | null => {
    if (typeof record.userId === "object" && record.userId !== null) {
      return record.userId as PopulatedUser;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100">
        <p className="text-xs text-slate-400 tracking-widest uppercase mb-0.5">
          04 — Live
        </p>
        <h2 className="text-base font-semibold text-slate-900">
          Today's Attendance
          {!loading && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              {records.length} records
            </span>
          )}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          </div>
        ) : records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm font-medium text-slate-500">
              No attendance records yet
            </p>
            <p className="text-xs text-slate-300">
              Staff check-ins will appear here
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  Staff
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  Check In
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  Check Out
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  Duration
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
                               text-slate-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  className="text-left px-6 py-3 text-xs font-semibold
               text-slate-400 uppercase tracking-wider"
                >
                  Mood
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {records.map((record) => (
                <tr
                  key={record._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full bg-slate-100
                        flex items-center justify-center shrink-0"
                      >
                        <span className="text-slate-500 text-xs font-bold">
                          {record.name?.[0]?.toUpperCase() ?? "?"}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-slate-900">
                        {record.name ?? "—"}
                      </span>
                    </div>
                  </td>

                  {/* Staff ID */}
                  <td className="px-6 py-4">
                    <span
                      className="text-xs font-mono font-semibold
                       text-slate-500 bg-slate-100
                       px-2 py-1 rounded-md"
                    >
                      {record.staffId ?? "—"}
                    </span>
                  </td>

                  {/* Check In */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {formatTime(record.checkIn)}
                    </span>
                  </td>

                  {/* Check Out */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-700">
                      {formatTime(record.checkOut)}
                    </span>
                  </td>

                  {/* Duration */}
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">
                      {formatMinutes(record.workMinutes)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs
                        font-semibold capitalize
                        ${statusStyles[record.status]}`}
                    >
                      {record.status}
                    </span>
                  </td>

                  {/* Mood */}
                  <td className="px-6 py-4">
                    {record.mood ? (
                      <span className="text-xl" title={record.mood}>
                        {moodEmoji[record.mood]}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
