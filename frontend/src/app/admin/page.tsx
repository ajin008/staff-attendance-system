"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import TodayAttendanceTable from "@/components/admin/TodayAttendanceTable";
import TodaySummaryCards from "@/components/admin/TodaySummary";
import DatePicker from "@/components/admin/DatePicker";

const getToday = () => new Date();

const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

export default function AdminPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(getToday);
  const today = getToday();
  const isToday = toDateString(selectedDate) === toDateString(today);

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar />
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Staff Attendance
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isToday
                ? "Today's overview"
                : `Showing ${toDateString(selectedDate)}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!isToday && (
              <button
                onClick={() => setSelectedDate(getToday())}
                className="text-xs text-slate-400 hover:text-slate-700
                           transition-colors underline underline-offset-2"
              >
                Back to today
              </button>
            )}
            <DatePicker selected={selectedDate} onSelect={setSelectedDate} />
          </div>
        </div>

        <TodaySummaryCards selectedDate={toDateString(selectedDate)} />
        <TodayAttendanceTable selectedDate={toDateString(selectedDate)} />
      </main>
    </div>
  );
}
