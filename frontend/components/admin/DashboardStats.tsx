// components/admin/DashboardStats.tsx
"use client";

import { useRouter } from "next/navigation";
import { Users, Building2, CalendarClock, ArrowUpRight } from "lucide-react";
import { useDashboardStats } from "@/src/hooks/useDashboardStats";

export default function DashboardStats() {
  const router = useRouter();
  const { stats, isLoading, error, refreshStats } = useDashboardStats();

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
          Metrics currently offline
        </p>
        <button
          onClick={refreshStats}
          className="text-[11px] text-slate-400 underline mt-1 hover:text-slate-600"
        >
          Retry Link
        </button>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
      route: "/admin/staff",
      label: "Active profiles",
    },
    {
      title: "Departments",
      value: stats.departmentCount,
      icon: Building2,
      route: "/admin/departments",
      label: "Functional units",
    },
    {
      title: "Leaves Tracking",
      value: stats.pendingLeaveRequests,
      icon: CalendarClock,
      route: "/admin/leaves",
      label: "Pending review",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1">
      {statCards.map((card) => {
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
