// app/staff/leave/page.tsx
"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { FileText, RefreshCw } from "lucide-react";
import { useMyLeaves } from "@/src/hooks/staff/useMyLeaves";
import LeaveHistoryTable from "@/components/staff/LeaveHistoryTable";
import { useLeaveRequest } from "@/src/hooks/staff/useLeaveRequest";
import LeaveRequestModal from "@/components/staff/LeaveRequestModal";

export default function LeaveHistoryPage() {
  const { leaves, isLoading, error, refreshLeaves } = useMyLeaves();

  const {
    isOpen: isLeaveModalOpen,
    isSubmitting: isLeaveSubmitting,
    openModal: openLeaveModal,
    closeModal: closeLeaveModal,
    submitLeaveRequest,
  } = useLeaveRequest({ onSuccess: refreshLeaves });

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

      {/* Hero Header Block Inherited From Admin Dashboard UI */}
      <div className="w-full bg-[#0F0F11] text-white pt-10 pb-24 border-b border-neutral-900">
        <div className="w-full max-w-[1600px] mx-auto px-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2 text-xs font-mono font-medium text-neutral-500 uppercase tracking-wider">
              <span>Overview</span>
              <span className="text-neutral-700">/</span>
              <span className="text-neutral-300">Time Off Logs</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-1">
              Leave Requests
            </h1>
            <p className="text-xs md:text-sm text-neutral-400 font-normal leading-relaxed max-w-xl">
              File new time-off absences, upload operational contingencies, and
              monitor management approval states.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 self-end sm:self-start pt-1">
            <span className="text-xs font-mono font-medium tracking-wider text-neutral-400 bg-neutral-900/60 border border-neutral-800/80 px-3 py-1.5 rounded-md inline-block whitespace-nowrap">
              {getFormattedDate()}
            </span>
            <button
              onClick={openLeaveModal}
              className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors focus:outline-none shadow-sm"
            >
              <FileText className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Create Request</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Stage Canvas */}
      <div className="w-full max-w-[1600px] mx-auto px-6 pb-16 flex-1 -mt-12 space-y-6">
        {/* System Error Message Banner */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xs">
            <div className="text-xs text-rose-800">
              <span className="font-bold">System Error:</span> {error}
            </div>
            <button
              onClick={refreshLeaves}
              className="flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 uppercase focus:outline-none"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry Sync</span>
            </button>
          </div>
        )}

        {/* Summary Metric Counters */}
        {!isLoading && leaves.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Requests Filed
              </span>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {leaves.length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Approved Applications
              </span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {leaves.filter((l) => l.status === "approved").length}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Review Matrix
              </span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {leaves.filter((l) => l.status === "pending").length}
              </p>
            </div>
          </div>
        )}

        {/* Main Data Table Wrapper Container */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Historical History Log
            </span>
          </div>
          <LeaveHistoryTable leaves={leaves} isLoading={isLoading} />
        </div>
      </div>

      {/* Form Submission Modal View */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        onSubmit={submitLeaveRequest}
        isSubmitting={isLeaveSubmitting}
      />
    </div>
  );
}
