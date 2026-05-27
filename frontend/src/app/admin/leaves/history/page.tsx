// app/admin/leaves/history/page.tsx
"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useAllLeavesHistory } from "@/src/hooks/admin-leave/useAllLeavesHistory";
import LeaveHistoryTable from "@/components/admin/leave/LeaveHistoryTable";

export default function AdminLeaveHistoryPage() {
  const router = useRouter();
  const { leaves, isLoading, error, refreshLeaves } = useAllLeavesHistory();

  const approvedCount = leaves.filter((l) => l.status === "approved").length;
  const rejectedCount = leaves.filter((l) => l.status === "rejected").length;
  const pendingCount = leaves.filter((l) => l.status === "pending").length;

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-400 mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to pending requests</span>
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 bg-slate-400 rounded-full" />
            <span className="text-[11px] font-mono text-slate-500 tracking-wider">
              LEAVE HISTORY
            </span>
          </div>
          <div>
            <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
              All Leave Requests
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Complete history of all employee leave requests
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-slate-400">Pending</p>
            </div>
            <p className="text-2xl font-light text-amber-600">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <p className="text-xs text-slate-400">Approved</p>
            </div>
            <p className="text-2xl font-light text-emerald-600">
              {approvedCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-rose-500" />
              <p className="text-xs text-slate-400">Rejected</p>
            </div>
            <p className="text-2xl font-light text-rose-600">{rejectedCount}</p>
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

        <LeaveHistoryTable leaves={leaves} isLoading={isLoading} />

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
