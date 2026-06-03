// app/staff/page.tsx (updated with FloorAllocationCard)

"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { CheckInOutButton } from "@/components/staff/CheckInOutButton";
import FloorAllocationCard from "@/components/staff/FloorAllocationCard";
import { useAuth } from "@/src/context/AuthContext";
import { useRoleGuard } from "@/src/hooks/useRoleGuard";

export default function StaffDashboardPage() {
  const { user } = useAuth();

  useRoleGuard("staff");

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <StaffNavbar />

      {/* Hero Header Block */}
      <div className="w-full bg-[#0F0F11] text-white pt-10 pb-24 border-b border-neutral-900">
        <div className="w-full max-w-400 mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
              <span>Overview</span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-300">Staff Workspace</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-1">
              Welcome back, {user?.name?.split(" ")[0] || "Employee"}
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed max-w-xl">
              Access your personal terminal gateway to register real-time shift
              markers, verify location criteria, and review workspace
              instructions.
            </p>
          </div>

          <div className="sm:text-right self-end sm:self-start pt-1">
            <span className="text-xs font-mono font-medium tracking-wider text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-md inline-block whitespace-nowrap">
              {getFormattedDate()}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Stage Canvas */}
      <div className="w-full max-w-400 mx-auto px-6 pb-16 flex-1 -mt-12">
        {/* Attendance Action Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1: Core Action Control Portal */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-1.5 shadow-xs">
              <CheckInOutButton />
            </div>

            {/* Floor Allocation Card */}
            <FloorAllocationCard />
          </div>

          {/* Column 2 & 3: Informational Compliance Guidelines Card */}
          <div className="lg:col-span-2 border border-slate-200 rounded-lg p-6 bg-white shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
              Daily Operational Guidelines
            </span>

            <div className="divide-y divide-slate-100 text-xs text-slate-600">
              <div className="pb-3.5 flex items-start gap-3">
                <span className="font-mono text-emerald-500 font-bold mt-0.5">
                  01.
                </span>
                <p className="leading-relaxed">
                  Please ensure your preferred web browser environment has{" "}
                  <strong className="text-slate-900 font-semibold">
                    location access services enabled
                  </strong>{" "}
                  prior to evaluating or dispatching any live attendance
                  registry updates.
                </p>
              </div>

              <div className="pt-3.5 flex items-start gap-3">
                <span className="font-mono text-emerald-500 font-bold mt-0.5">
                  02.
                </span>
                <p className="leading-relaxed">
                  All biometric and coordinate data logs are securely validated
                  in real time against your designated office infrastructure
                  parameter boundaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
