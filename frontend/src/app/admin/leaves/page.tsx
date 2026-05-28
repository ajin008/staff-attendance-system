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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <AdminNavbar />

      {/* Main Content Stage Canvas */}
      <main className="w-full max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Navigation Breadcrumb Line & History Link */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="group flex items-center gap-1.5 text-xs font-mono font-bold text-slate-400 hover:text-slate-900 uppercase tracking-wider transition-colors focus:outline-none"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform stroke-[2.5]" />
              <span>Back</span>
            </button>
            <span className="text-slate-300 font-mono text-xs">/</span>
            <span className="text-xs font-mono font-medium text-slate-400 uppercase tracking-wider">
              Leave Ledger
            </span>
          </div>

          <button
            onClick={() => router.push("/admin/leaves/history")}
            className="group flex items-center gap-2 px-3 py-1.5 rounded bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 text-xs font-mono font-bold uppercase tracking-wider shadow-2xs transition-all focus:outline-none"
          >
            <History className="h-3.5 w-3.5 stroke-[2]" />
            <span>View History Ledger</span>
          </button>
        </div>

        {/* Section Header Action Control Panel Block */}
        <div className="border border-slate-200 rounded-lg p-5 bg-white shadow-2xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Administrative Workspace
              </span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Pending Leave Requests
              </h1>
            </div>

            {pendingCount > 0 && (
              <div className="flex items-center gap-2 self-start sm:self-center px-2.5 py-1 rounded border border-amber-200 bg-amber-50 text-amber-700 text-xs font-mono font-bold uppercase tracking-wider">
                <CalendarClock className="h-3.5 w-3.5 text-amber-600 stroke-[2]" />
                <span>
                  {pendingCount} Pending{" "}
                  {pendingCount === 1 ? "Record" : "Records"}
                </span>
              </div>
            )}
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

        {/* Core Administrative Ledger Grid Block */}
        <div className="bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs">
          <LeaveRequestsTable
            leaves={leaves}
            isLoading={isLoading}
            processingId={processingId}
            onApprove={approveLeave}
            onReject={rejectLeave}
          />
        </div>
      </main>
    </div>
  );
}
