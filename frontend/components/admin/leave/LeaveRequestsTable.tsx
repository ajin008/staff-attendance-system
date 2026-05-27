// components/admin/LeaveRequestsTable.tsx
"use client";

import { Check, X, Calendar, Building2, Loader2 } from "lucide-react";
import type { Leave } from "@/src/services/leave.service";

interface LeaveRequestsTableProps {
  leaves: Leave[];
  isLoading: boolean;
  processingId: number | null;
  onApprove: (leaveId: number) => void;
  onReject: (leaveId: number) => void;
}

export default function LeaveRequestsTable({
  leaves,
  isLoading,
  processingId,
  onApprove,
  onReject,
}: LeaveRequestsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLeaveTypeLabel = (type: string) => {
    switch (type) {
      case "sick":
        return "Sick Leave";
      case "casual":
        return "Casual Leave";
      case "emergency":
        return "Emergency Leave";
      default:
        return type;
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "sick":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "casual":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "emergency":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return {
          label: "Approved",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
      case "rejected":
        return {
          label: "Rejected",
          className: "bg-rose-50 text-rose-700 border-rose-200",
        };
      default:
        return {
          label: "Pending",
          className: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        <span className="ml-2 text-sm text-slate-400">
          Loading leave requests...
        </span>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No leave requests found</p>
        <p className="text-xs text-slate-400 mt-1">
          All leave requests have been processed
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Leave Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Days
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Reason
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.map((leave) => {
              const statusBadge = getStatusBadge(leave.status);
              const isPending = leave.status === "pending";

              return (
                <tr
                  key={leave.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-slate-600">
                          {leave.user?.name?.charAt(0) || "?"}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {leave.user?.name || "Unknown"}
                        </p>
                        <p className="text-xs font-mono text-slate-400">
                          {leave.user?.staffId || "N/A"}
                        </p>
                        {leave.user?.department && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            <span className="text-xs text-slate-400">
                              {leave.user.department.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getLeaveTypeColor(
                        leave.leaveType
                      )}`}
                    >
                      {getLeaveTypeLabel(leave.leaveType)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm text-slate-700">
                        {formatDate(leave.startDate)}
                      </span>
                      <span className="text-xs text-slate-400">to</span>
                      <span className="text-sm text-slate-700">
                        {formatDate(leave.endDate)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-sm text-slate-600">
                        {leave.totalDays}{" "}
                        {leave.totalDays === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-slate-600 line-clamp-2">
                        {leave.reason}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${statusBadge.className}`}
                      >
                        {statusBadge.label}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onApprove(leave.id)}
                        disabled={processingId === leave.id || !isPending}
                        className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!isPending ? "Already processed" : "Approve"}
                      >
                        {processingId === leave.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onReject(leave.id)}
                        disabled={processingId === leave.id || !isPending}
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title={!isPending ? "Already processed" : "Reject"}
                      >
                        {processingId === leave.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
