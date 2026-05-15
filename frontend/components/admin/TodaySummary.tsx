"use client";

import { useEffect, useState } from "react";
import { getTodaySummary } from "@/src/services/attendance.service";
import { TodaySummary } from "@/src/types";
import { Loader2 } from "lucide-react";

interface Props {
  selectedDate: string;
}

export default function TodaySummaryCards({ selectedDate }: Props) {
  const [data, setData] = useState<TodaySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("selectedDate in component:", selectedDate);
    getTodaySummary(selectedDate)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const cards = [
    {
      label: "Total Staff",
      value: data?.total ?? 0,
      color: "bg-slate-900",
      text: "text-white",
      sub: "text-slate-400",
    },
    {
      label: "Present",
      value: data?.present ?? 0,
      color: "bg-white",
      text: "text-emerald-600",
      sub: "text-slate-400",
      border: true,
    },
    {
      label: "Incomplete",
      value: data?.incomplete ?? 0,
      color: "bg-white",
      text: "text-blue-600",
      sub: "text-slate-400",
      border: true,
    },
    {
      label: "Absent",
      value: data?.absent ?? 0,
      color: "bg-white",
      text: "text-red-500",
      sub: "text-slate-400",
      border: true,
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-100
                                   p-6 flex items-center justify-center h-32"
          >
            <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Section label */}
      <div className="mb-4">
        <p className="text-xs text-slate-400 tracking-widest uppercase">
          03 — Today's Summary ·{" "}
          {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl p-6 flex flex-col justify-between h-32
                        ${card.color}
                        ${card.border ? "border border-slate-100" : ""}`}
          >
            <p
              className={`text-xs font-semibold uppercase tracking-widest
                          ${
                            card.color === "bg-slate-900"
                              ? "text-slate-400"
                              : "text-slate-400"
                          }`}
            >
              {card.label}
            </p>
            <p className={`text-4xl font-bold tracking-tight ${card.text}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {data && data.total > 0 && (
        <div className="mt-4 bg-white rounded-2xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-slate-400 uppercase tracking-widest">
              Attendance Rate
            </p>
            <p className="text-xs font-semibold text-slate-700">
              {Math.round((data.present / data.total) * 100)}%
            </p>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(data.present / data.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
