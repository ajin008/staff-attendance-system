/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface Props {
  selected: Date;
  onSelect: (date: Date) => void;
}

export default function DatePicker({ selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState<Date>(new Date());

  useEffect(() => {
    // Set today's date in local timezone
    const now = new Date();
    setToday(new Date(now.getFullYear(), now.getMonth(), now.getDate()));
  }, []);

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Create local date at midnight
      const localDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
      onSelect(localDate);
      setOpen(false);
    }
  };

  // Disable dates that are before today (local timezone)
  const disabledDays = (date: Date) => {
    const compareDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const compareToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    return compareDate < compareToday;
  };

  const displayDate = selected.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl
                   border border-slate-200 bg-white hover:bg-slate-50
                   transition-colors text-sm text-slate-700 w-full"
      >
        <svg
          className="h-3.5 w-3.5 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        {displayDate}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-11 z-20 bg-white
                          rounded-2xl border border-slate-100
                          shadow-xl shadow-slate-200/50 p-3"
          >
            <DayPicker
              mode="single"
              selected={selected}
              onSelect={handleSelect}
              disabled={disabledDays}
              defaultMonth={today}
              modifiersClassNames={{
                selected: "bg-emerald-500 text-white rounded-md",
                today: "border border-emerald-500 rounded-md",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
