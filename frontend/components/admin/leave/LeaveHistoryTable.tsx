// components/admin/leave/LeaveHistoryTable.tsx
"use client";

import { Calendar, Building2, Loader2 } from "lucide-react";
import type { Leave } from "@/src/services/leave.service";

interface LeaveHistoryTableProps {
  leaves: Leave[];
  isLoading: boolean;
}

export default function LeaveHistoryTable({
  leaves,
  isLoading,
}: LeaveHistoryTableProps) {
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
        return "bg-blue-50 text-blue-700";
      case "casual":
        return "bg-purple-50 text-purple-700";
      case "emergency":
        return "bg-red-50 text-red-700";
      default:
        return "bg-slate-50 text-slate-700";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-emerald-50 text-emerald-700";
      case "rejected":
        return "bg-rose-50 text-rose-700";
      default:
        return "bg-amber-50 text-amber-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-500">No leave requests found</p>
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
              <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Requested On
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
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
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(
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
                  <span className="text-sm text-slate-600">
                    {leave.totalDays} day{leave.totalDays !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-600 max-w-xs line-clamp-2">
                    {leave.reason}
                  </p>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                      leave.status
                    )}`}
                  >
                    {leave.status.charAt(0).toUpperCase() +
                      leave.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">
                    {formatDate(leave.createdAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
