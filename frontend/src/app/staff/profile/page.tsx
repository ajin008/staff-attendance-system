// app/staff/profile/page.tsx
"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { useMyProfile } from "@/src/hooks/staff/useMyProfile";
import {
  Mail,
  Phone,
  Briefcase,
  Clock,
  IndianRupee,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function StaffProfilePage() {
  const { profile, isLoading, error, refreshProfile } = useMyProfile();

  // Parses military 24hr strings (e.g., "09:00") into local 12hr strings (e.g., "09:00 AM")
  const formatTime12Hour = (timeStr?: string): string => {
    if (!timeStr) return "—";
    try {
      const [hours, minutes] = timeStr.split(":");
      const hourNum = parseInt(hours, 10);
      const ampm = hourNum >= 12 ? "PM" : "AM";
      const displayHour = hourNum % 12 || 12;
      const displayHourStr = String(displayHour).padStart(2, "0");
      return `${displayHourStr}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    return new Date(isoString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <StaffNavbar />

      {/* Hero Header Block Inherited From Admin Dashboard UI */}
      <div className="w-full bg-[#0F0F11] text-white pt-10 pb-24 border-b border-neutral-900">
        <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
              <span>Overview</span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-300">Account Profile</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-1">
              My Profile
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed max-w-xl">
              Manage your personal corporate credentials, workplace parameter
              structures, and active base payroll metadata details.
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
      <div className="w-full max-w-[1600px] mx-auto px-6 pb-16 flex-1 -mt-12 space-y-6">
        {/* Global Loading View */}
        {isLoading && (
          <div className="border border-slate-200 rounded-lg p-12 bg-white shadow-xs flex items-center justify-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            <span className="text-xs font-medium text-slate-500">
              Syncing database parameters...
            </span>
          </div>
        )}

        {/* Error Exception Banner */}
        {error && !isLoading && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="text-xs text-rose-800">
              <span className="font-bold">Sync Error:</span> {error}
            </div>
            <button
              onClick={refreshProfile}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 uppercase focus:outline-none"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry Pipeline</span>
            </button>
          </div>
        )}

        {/* Profile Split-Workspace Layout Matrix */}
        {!isLoading && !error && profile && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* Column 1: Core Personal Credentials Card */}
            <div className="lg:col-span-1 border border-slate-200 rounded-lg p-6 bg-white shadow-xs space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border border-slate-200 bg-slate-50 flex items-center justify-center text-slate-500 font-bold text-lg select-none">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">
                    {profile.name}
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block tracking-wide mt-0.5">
                    ID Reference:{" "}
                    <span className="font-mono font-bold text-slate-600">
                      {profile.staffId || "ST-000"}
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3.5 text-xs">
                <div className="flex items-start gap-3 text-slate-600">
                  <Mail className="h-4 w-4 text-slate-300 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-tight">
                      Email System
                    </span>
                    <span className="font-semibold text-slate-800 block truncate mt-0.5">
                      {profile.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Phone className="h-4 w-4 text-slate-300 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-tight">
                      Contact Line
                    </span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {profile.phone || "—"}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-600">
                  <Calendar className="h-4 w-4 text-slate-300 shrink-0" />
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-tight">
                      Joining Date
                    </span>
                    <span className="font-semibold text-slate-800 block mt-0.5">
                      {formatDate(profile.joinedOn)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 & 3: Corporate and Rule Deployment Matrices */}
            <div className="lg:col-span-2 space-y-6">
              {/* Box Segment A: Workplace Allocations */}
              <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
                  Organization Assignment
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="flex gap-3">
                    <Briefcase className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block">
                        Department Segment
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {profile.department?.name || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Briefcase className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block">
                        Operating Office Branch
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {profile.branch?.name || "N/A"}
                      </p>
                      {profile.branch && (
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          • Geofence Threshold: {profile.branch.allowedRadius}{" "}
                          meters
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box Segment B: Timing parameters & Base Payroll */}
              <div className="border border-slate-200 rounded-lg p-6 bg-white shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-4">
                  Shift Logs & Compensation Matrix
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
                  <div className="flex gap-3">
                    <Clock className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block">
                        Active Shift Frame
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {formatTime12Hour(profile.shiftStart)} —{" "}
                        {formatTime12Hour(profile.shiftEnd)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <IndianRupee className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block">
                        Fixed Base Salary
                      </span>
                      <p className="font-semibold text-slate-800 mt-0.5">
                        {profile.salary
                          ? `₹${profile.salary.toLocaleString("en-IN")} / month`
                          : "₹0 / month"}
                      </p>

                      {/* Sub-overtime parameters rendering logic safely */}
                      {profile.overtimeEnabled ? (
                        <div className="mt-2 text-[10px] text-emerald-600 font-semibold space-y-0.5 border-t border-slate-50 pt-1.5">
                          <p>
                            • Overtime Pay Rate: ₹
                            {profile.overtimeHourlyRate || 0}/hour
                          </p>
                          <p>
                            • Grace Clock Offset:{" "}
                            {profile.overtimeGraceMins || 0} minutes
                          </p>
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 font-medium mt-1.5">
                          • Overtime tracking disabled
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
