// components/staff/LeaveHistoryTable.tsx
"use client";

import { Calendar, Clock, Loader2, ArrowRight } from "lucide-react";
import type { Leave } from "@/src/services/leave.service";
import LeaveStatusBadge from "./LeaveStatusBadge";

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
    return date.toLocaleDateString("en-IN", {
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
        return "text-blue-600 bg-blue-50/60 border border-blue-100";
      case "casual":
        return "text-purple-600 bg-purple-50/60 border border-purple-100";
      case "emergency":
        return "text-rose-600 bg-rose-50/60 border border-rose-100";
      default:
        return "text-slate-600 bg-slate-50 border border-slate-100";
    }
  };

  if (isLoading) {
    return (
      <div className="border border-slate-200 rounded-lg p-12 bg-white shadow-xs flex items-center justify-center gap-3">
        <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
        <span className="text-xs font-medium text-slate-500">
          Loading leave historical registry...
        </span>
      </div>
    );
  }

  if (leaves.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-slate-200 shadow-xs">
        <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
        <p className="text-xs font-semibold text-slate-800">
          No leave requests found
        </p>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Your submitted historical applications will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200">
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Leave Category
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Duration Timeline
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                Total
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Reason Statement
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Submitted
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {leaves.map((leave) => (
              <tr
                key={leave.id}
                className="hover:bg-slate-50/40 transition-colors"
              >
                {/* Category Badge Column */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${getLeaveTypeColor(
                      leave.leaveType
                    )}`}
                  >
                    {getLeaveTypeLabel(leave.leaveType)}
                  </span>
                </td>

                {/* Timeline Range Column */}
                <td className="px-5 py-4 whitespace-nowrap font-medium text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>{formatDate(leave.startDate)}</span>
                    <ArrowRight className="h-3 w-3 text-slate-300" />
                    <span>{formatDate(leave.endDate)}</span>
                  </div>
                </td>

                {/* Days Count Column */}
                <td className="px-5 py-4 whitespace-nowrap text-center">
                  <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                    {leave.totalDays}
                  </span>
                </td>

                {/* Reason Text Snippet Column */}
                <td className="px-5 py-4">
                  <div className="max-w-xs">
                    <p
                      className="text-slate-600 line-clamp-1 leading-relaxed"
                      title={leave.reason}
                    >
                      {leave.reason}
                    </p>
                  </div>
                </td>

                {/* Status Column */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <LeaveStatusBadge status={leave.status} />
                </td>

                {/* Created On Timestamp Column */}
                <td className="px-5 py-4 whitespace-nowrap text-slate-400">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-300" />
                    <span>{formatDate(leave.createdAt)}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
