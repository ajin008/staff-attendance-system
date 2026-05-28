// components/staff/AttendanceSummary.tsx
"use client";

import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";

interface AttendanceSummaryProps {
  summary: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    lateDays: number;
    totalWorkHours: number;
  };
}

export default function AttendanceSummary({ summary }: AttendanceSummaryProps) {
  const attendanceRate =
    summary.totalDays > 0
      ? ((summary.presentDays / summary.totalDays) * 100).toFixed(1)
      : "0";

  const cards = [
    {
      title: "Total Days",
      value: summary.totalDays,
      icon: Calendar,
      color: "bg-slate-50 text-slate-600",
      borderColor: "border-slate-100",
    },
    {
      title: "Present",
      value: summary.presentDays,
      icon: CheckCircle,
      color: "bg-emerald-50 text-emerald-600",
      borderColor: "border-emerald-100",
    },
    {
      title: "Absent",
      value: summary.absentDays,
      icon: XCircle,
      color: "bg-rose-50 text-rose-600",
      borderColor: "border-rose-100",
    },
    {
      title: "Late Arrivals",
      value: summary.lateDays,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      borderColor: "border-amber-100",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`bg-white rounded-xl border ${card.borderColor} p-4`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 mb-1">{card.title}</p>
                <p className="text-2xl font-light text-slate-800">
                  {card.value}
                </p>
              </div>
              <div className={`p-2 rounded-lg ${card.color} bg-opacity-10`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Attendance Rate Card */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-600 font-medium mb-1">
              Attendance Rate
            </p>
            <p className="text-3xl font-light text-emerald-700">
              {attendanceRate}%
            </p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3"
              />
              <circle
                cx="20"
                cy="20"
                r="16"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                strokeDasharray={`${parseFloat(attendanceRate) * 1.01} 100`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5">
          <div
            className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${attendanceRate}%` }}
          />
        </div>
      </div>
    </div>
  );
}
