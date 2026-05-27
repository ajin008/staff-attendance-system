// app/staff/leave/page.tsx
"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar as CalendarIcon, FileText } from "lucide-react";
import { useMyLeaves } from "@/src/hooks/staff/useMyLeaves";
import LeaveHistoryTable from "@/components/staff/LeaveHistoryTable";
import { useLeaveRequest } from "@/src/hooks/staff/useLeaveRequest";
import LeaveRequestModal from "@/components/staff/LeaveRequestModal";

export default function LeaveHistoryPage() {
  const router = useRouter();
  const { leaves, isLoading, error, refreshLeaves } = useMyLeaves();

  const {
    isOpen: isLeaveModalOpen,
    isSubmitting: isLeaveSubmitting,
    openModal: openLeaveModal,
    closeModal: closeLeaveModal,
    submitLeaveRequest,
  } = useLeaveRequest({ onSuccess: refreshLeaves });

  return (
    <>
      <StaffNavbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Back Button */}
          {/* <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>back to dashboard</span>
          </button> */}

          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-emerald-400 rounded-full" />
              <span className="text-[11px] font-mono text-emerald-500 tracking-wider">
                LEAVE HISTORY
              </span>
            </div>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
                  My Leave Requests
                </h1>
                <p className="text-sm text-slate-400 mt-2">
                  View and track your leave requests
                </p>
              </div>
              <button
                onClick={openLeaveModal}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
              >
                <FileText className="h-4 w-4" />
                New Leave Request
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          {!isLoading && leaves.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Total Requests</p>
                <p className="text-2xl font-light text-slate-800">
                  {leaves.length}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Approved</p>
                <p className="text-2xl font-light text-emerald-600">
                  {leaves.filter((l) => l.status === "approved").length}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 p-4">
                <p className="text-xs text-slate-400 mb-1">Pending</p>
                <p className="text-2xl font-light text-amber-600">
                  {leaves.filter((l) => l.status === "pending").length}
                </p>
              </div>
            </div>
          )}

          {/* Error State */}
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

          {/* Leave History Table */}
          <LeaveHistoryTable leaves={leaves} isLoading={isLoading} />

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

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        onSubmit={submitLeaveRequest}
        isSubmitting={isLeaveSubmitting}
      />
    </>
  );
}
