// app/staff/page.tsx
"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { CheckInOutButton } from "@/components/staff/CheckInOutButton";
import { useAuth } from "@/src/context/AuthContext";

export default function StaffDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <StaffNavbar />
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Welcome Section */}
          <div className="mb-10 lg:mb-12">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-emerald-400 rounded-full" />
              <span className="text-[11px] font-mono text-emerald-500 tracking-wider">
                DASHBOARD
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
              Welcome back,{" "}
              <span className="font-medium">
                {user?.name?.split(" ")[0] || "Staff"}
              </span>
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Check In/Out Section */}
          <div className="max-w-md">
            <CheckInOutButton />
          </div>

          {/* Decorative elements */}
          <div className="fixed bottom-8 right-8 opacity-30 pointer-events-none">
            <svg className="w-32 h-32" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="4 6"
                className="text-slate-400"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
}
