// app/admin/page.tsx
"use client";

import { useState } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import CardinalNav from "@/components/admin/CardinalNav";
import FloorMap from "@/components/admin/floor/FloorMap";
import PayrollPage from "./paryole/page";
import DashboardClient from "@/components/admin/admin-dashbaord/DashboardClient";
import { useAuth } from "@/src/context/AuthContext";
import NotificationsPage from "./notifications/page";
import { useRoleGuard } from "@/src/hooks/useRoleGuard";
import Attendance from "@/components/admin/attendance/Attendance";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();

  useRoleGuard("admin");

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardClient />;
      case "attendance":
        return <Attendance />;
      case "floor":
        return <FloorMap />;
      case "payroll":
        return <PayrollPage />;
      case "notifications":
        return <NotificationsPage />;
      default:
        return <DashboardClient />;
    }
  };

  const adminName = user?.name || "Administrator";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      {/* Top Header Navigation Block */}
      <div className="w-full bg-white border-b border-slate-100">
        <AdminNavbar />
        <CardinalNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Hero Header Block - ONLY for dashboard */}
      {activeTab === "dashboard" && (
        <div className="w-full bg-[#0F0F11] text-white pt-10 pb-24 border-b border-neutral-900">
          <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left Column: Context Metadata & Dynamic Greeting */}
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
                <span>Overview</span>
                <span className="text-neutral-700">/</span>
                <span className="text-neutral-300">Workspace</span>
              </div>

              {isLoading ? (
                <div className="space-y-3 pt-1">
                  <div className="h-9 w-64 bg-neutral-800 rounded-lg animate-pulse" />
                  <div className="h-4 w-96 bg-neutral-800 rounded-md animate-pulse" />
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-1">
                    Welcome back, {adminName}
                  </h1>

                  <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed max-w-xl">
                    Monitor real-time system logs, audit staff clock-ins, and
                    oversee pending workspace metrics.
                  </p>
                </>
              )}
            </div>

            {/* Right Column: Precise Operational Date Badge */}
            <div className="sm:text-right self-end sm:self-start pt-1">
              <span className="text-xs font-mono font-medium tracking-wider text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-md inline-block whitespace-nowrap">
                {getFormattedDate()}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Different handling for dashboard vs other tabs */}
      {activeTab === "dashboard" ? (
        <div className="w-full max-w-[1600px] mx-auto px-6 pb-16 flex-1 -mt-12">
          {renderContent()}
        </div>
      ) : (
        // For non-dashboard tabs (like floor map), render without the container constraints
        <div className="flex-1">{renderContent()}</div>
      )}
    </div>
  );
}
