// components/admin/admin-dashboard/DashboardClient.tsx
"use client";

import DashboardStats from "@/components/admin/DashboardStats";
import DashboardAttendanceStats from "@/components/admin/DashboardAttendanceStats";
import QuickActions from "./QuickActions";

export default function DashboardClient() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch w-full max-w-[1600px] mx-auto">
      {/* Left Column: Metric Cards (Spans 2 columns) */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <DashboardStats />
        <DashboardAttendanceStats />
      </div>

      {/* Right Column: Active Component Canvas (Spans 1 column) */}
      <div className="w-full">
        <QuickActions />
      </div>
    </div>
  );
}
