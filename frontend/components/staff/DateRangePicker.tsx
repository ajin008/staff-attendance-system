// components/staff/DateRangePicker.tsx
"use client";

import { Calendar, X } from "lucide-react";

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: DateRangePickerProps) {
  const hasFilter = startDate !== "" || endDate !== "";

  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          max={getTodayDate()}
          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-300 bg-white"
          placeholder="Start Date"
        />
      </div>

      <span className="text-slate-400 text-sm">—</span>

      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          min={startDate || undefined}
          max={getTodayDate()}
          className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-slate-300 bg-white"
          placeholder="End Date"
        />
      </div>

      {hasFilter && (
        <button
          onClick={onReset}
          className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  );
}
