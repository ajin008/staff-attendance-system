// app/admin/leaves/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarClock, History } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAdminLeaves } from "@/src/hooks/admin-leave/useAdminLeaves";
import LeaveRequestsTable from "@/components/admin/leave/LeaveRequestsTable";

export default function AdminLeavesPage() {
  const router = useRouter();
  const {
    leaves, // This is now ONLY pending leaves
    pendingCount, // This is the count of pending leaves
    isLoading,
    error,
    processingId,
    approveLeave,
    rejectLeave,
    refreshLeaves,
  } = useAdminLeaves();

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-400 mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>back to dashboard</span>
          </button>

          {/* View All History Button */}
          <button
            onClick={() => router.push("/admin/leaves/history")}
            className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
          >
            <History className="h-4 w-4" />
            <span>view all history</span>
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-amber-400 rounded-full" />
            <span className="text-[11px] font-mono text-amber-500 tracking-wider">
              LEAVE MANAGEMENT
            </span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
                Pending Requests
              </h1>
              <p className="text-sm text-slate-400 mt-2">
                Review and manage employee leave requests
              </p>
            </div>
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100">
                <CalendarClock className="h-4 w-4 text-amber-500" />
                <span className="text-sm font-medium text-amber-700">
                  {pendingCount} pending{" "}
                  {pendingCount === 1 ? "request" : "requests"}
                </span>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 text-center mb-6">
            <p className="text-sm text-rose-600">{error}</p>
            <button
              onClick={refreshLeaves}
              className="mt-3 text-xs text-rose-500 hover:text-rose-700 underline"
            >
              try again
            </button>
          </div>
        )}

        <LeaveRequestsTable
          leaves={leaves}
          isLoading={isLoading}
          processingId={processingId}
          onApprove={approveLeave}
          onReject={rejectLeave}
        />

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
  );
}
