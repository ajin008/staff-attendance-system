// components/admin/DashboardAttendanceStats.tsx
"use client";

import { useRouter } from "next/navigation";
import { UserCheck, UserX, Clock, ArrowUpRight } from "lucide-react";
import { useAttendanceStats } from "@/src/hooks/useAttendanceStats";

export default function DashboardAttendanceStats() {
  const router = useRouter();
  const { stats, isLoading, error, refreshStats } = useAttendanceStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-40 rounded-[22px] bg-white border border-slate-100 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[22px] border border-rose-100 bg-white p-6 text-center">
        <p className="text-xs text-rose-600 font-medium">
          Attendance feeds unlinked
        </p>
        <button
          onClick={refreshStats}
          className="text-[11px] text-slate-400 underline mt-1 hover:text-slate-600"
        >
          Reconnect
        </button>
      </div>
    );
  }

  const attendanceCards = [
    {
      title: "Present Today",
      value: stats.presentToday,
      icon: UserCheck,
      route: "/admin/attendance/present",
      label: "Checked in",
    },
    {
      title: "Absent Today",
      value: stats.absentToday,
      icon: UserX,
      route: "/admin/attendance/absent",
      label: "Out of office",
    },
    {
      title: "Late Arrivals",
      value: stats.lateCheckIn,
      icon: Clock,
      route: "/admin/attendance/late",
      label: "Past shift start",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
      {attendanceCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.title}
            onClick={() => router.push(card.route)}
            className="group flex flex-col justify-between p-6 min-h-[160px] bg-white rounded-[22px] border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-300 text-left w-full"
          >
            <div className="w-full flex items-start justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-medium tracking-tight text-slate-400 block uppercase font-mono">
                  {card.title}
                </span>
                <span className="text-3xl font-bold text-slate-900 tracking-tight block">
                  {card.value}
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 group-hover:bg-[#0F0F11] group-hover:text-white transition-colors duration-300">
                <Icon className="h-4 w-4" />
              </div>
            </div>

            <div className="w-full flex items-center justify-between pt-4 border-t border-slate-100/60 mt-4">
              <span className="text-[11px] text-slate-400 font-medium group-hover:text-slate-600 transition-colors">
                {card.label}
              </span>
              <div className="p-1 rounded-full bg-slate-50 group-hover:bg-slate-900/5 transition-colors">
                <ArrowUpRight className="h-3 w-3 text-slate-400 group-hover:text-slate-800 transition-colors" />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
