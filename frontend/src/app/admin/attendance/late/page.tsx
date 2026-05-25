// app/admin/attendance/late/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAttendanceStats } from "@/src/hooks/useAttendanceStats";
import AttendanceStaffTable from "@/components/admin/attendence/AttendanceStaffTable";

export default function LateAttendancePage() {
  const router = useRouter();
  const { attendanceData, isLoading, error } = useAttendanceStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>back to dashboard</span>
          </button>
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-xs text-rose-500 hover:text-rose-700 underline"
            >
              try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to dashboard</span>
        </button>

        <div className="mb-6">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            03 — Attendance
          </p>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Late Check-in
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Staff members who checked in after shift start
          </p>
        </div>

        <AttendanceStaffTable
          staffList={attendanceData?.late?.staff || []}
          type="late"
          emptyMessage="No late check-ins today"
        />
      </div>
    </div>
  );
}
