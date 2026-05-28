// app/admin/leaves/history/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <AdminNavbar />

      {/* Main Content Stage Canvas */}
      <main className="w-full max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Navigation Breadcrumb Line */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors focus:outline-none"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
            <span>Back</span>
          </button>
          <span className="text-slate-300 font-mono text-xs">/</span>
          <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
            Archive Registry
          </span>
        </div>

        {/* Section Header Component Block */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs mb-6">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Historical Records
          </span>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            All Leave Requests
          </h1>
        </div>

        {/* High-Density Metric Grid Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {/* Card: Pending Counter */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Pending Audit
              </span>
              <p className="text-2xl font-mono font-bold text-amber-600 leading-none">
                {pendingCount}
              </p>
            </div>
            <div className="w-8 h-8 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500">
              <Clock className="h-4 w-4 stroke-[2]" />
            </div>
          </div>

          {/* Card: Approved Counter */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Approved Cycles
              </span>
              <p className="text-2xl font-mono font-bold text-emerald-600 leading-none">
                {approvedCount}
              </p>
            </div>
            <div className="w-8 h-8 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500">
              <CheckCircle className="h-4 w-4 stroke-[2]" />
            </div>
          </div>

          {/* Card: Rejected Counter */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Rejected / Cancelled
              </span>
              <p className="text-2xl font-mono font-bold text-rose-600 leading-none">
                {rejectedCount}
              </p>
            </div>
            <div className="w-8 h-8 rounded bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
              <XCircle className="h-4 w-4 stroke-[2]" />
            </div>
          </div>
        </div>

        {/* Fallback Exception Alert Indicator */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-5 mb-6 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 block">
                System Exception Raised
              </span>
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
            <button
              onClick={refreshLeaves}
              className="text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded transition-colors focus:outline-none"
            >
              Re-Sync Matrix
            </button>
          </div>
        )}

        {/* History Records Table Data Ledger Block */}
        <div className="bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs">
          <LeaveHistoryTable leaves={leaves} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}
