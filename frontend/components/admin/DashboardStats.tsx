// components/admin/DashboardStats.tsx
"use client";

import { useRouter } from "next/navigation";
import { Users, Building2, CalendarClock, ArrowRight } from "lucide-react";
import { useDashboardStats } from "@/src/hooks/useDashboardStats";

interface DashboardStatsProps {
  refreshTrigger?: () => void;
}

export default function DashboardStats({
  refreshTrigger,
}: DashboardStatsProps) {
  const router = useRouter();
  const { stats, isLoading, error, refreshStats } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm animate-pulse"
          >
            <div className="p-6">
              <div className="h-4 bg-slate-100 rounded w-24 mb-4"></div>
              <div className="h-10 bg-slate-100 rounded w-20 mb-3"></div>
              <div className="h-3 bg-slate-100 rounded w-32"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6">
        <div className="relative overflow-hidden rounded-2xl bg-rose-50/30 border border-rose-100 p-8 text-center">
          <p className="text-sm text-rose-600 font-medium">
            Failed to load dashboard
          </p>
          <button
            onClick={refreshStats}
            className="mt-3 text-xs text-rose-500 hover:text-rose-700 underline-offset-2 underline"
          >
            try again
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Staff",
      value: stats.totalStaff,
      icon: Users,
      route: "/admin/staff",
      color: "from-emerald-50 to-emerald-100/30",
      hoverColor: "group-hover:from-emerald-100 group-hover:to-emerald-200/40",
      borderColor: "border-emerald-100",
      accentColor: "bg-emerald-500",
      description: "active employees",
    },
    {
      title: "Departments",
      value: stats.departmentCount,
      icon: Building2,
      route: "/admin/departments",
      color: "from-blue-50 to-blue-100/30",
      hoverColor: "group-hover:from-blue-100 group-hover:to-blue-200/40",
      borderColor: "border-blue-100",
      accentColor: "bg-blue-500",
      description: "total departments",
    },
    {
      title: "Leave Requests",
      value: stats.pendingLeaveRequests,
      icon: CalendarClock,
      route: "/admin/leaves",
      color: "from-amber-50 to-amber-100/30",
      hoverColor: "group-hover:from-amber-100 group-hover:to-amber-200/40",
      borderColor: "border-amber-100",
      accentColor: "bg-amber-500",
      description: "pending approval",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <button
            key={card.title}
            onClick={() => router.push(card.route)}
            className="group relative text-left w-full transition-all duration-300 ease-out hover:-translate-y-1 active:translate-y-0"
          >
            {/* Card body */}
            <div
              className={`relative overflow-hidden rounded-2xl border ${card.borderColor} bg-gradient-to-br ${card.color} ${card.hoverColor} transition-all duration-300 shadow-sm hover:shadow-md`}
            >
              {/* Organic accent line at top */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 ${card.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-[0.2em] mb-3">
                      {card.title}
                    </p>
                    <p className="text-4xl font-light tracking-tight text-slate-800 mb-1.5">
                      {card.value}
                    </p>
                    <p className="text-xs text-slate-400 font-normal">
                      {card.description}
                    </p>
                  </div>

                  {/* Icon with organic circle background */}
                  <div className="relative">
                    <div
                      className={`absolute inset-0 rounded-full ${card.accentColor} opacity-10 scale-0 group-hover:scale-100 transition-transform duration-500`}
                    />
                    <div className="relative p-2.5">
                      <Icon
                        className={`h-5 w-5 ${card.accentColor.replace(
                          "bg-",
                          "text-"
                        )} opacity-70 group-hover:opacity-100 transition-opacity duration-200`}
                      />
                    </div>
                  </div>
                </div>

                {/* View button - appears on hover */}
                <div className="mt-5 flex items-center justify-end">
                  <span className="text-[11px] font-mono font-medium text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5 group-hover:text-slate-600 transition-colors duration-200">
                    view all
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </div>
              </div>

              {/* Subtle corner decoration */}
              <div className="absolute bottom-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
                <svg
                  viewBox="0 0 100 100"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 0L100 100L0 100"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
