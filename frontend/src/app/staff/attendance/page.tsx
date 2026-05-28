// app/staff/attendance/page.tsx
"use client";

import { StaffNavbar } from "@/components/staff/StaffNavbar";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";
import { useStaffAttendanceHistory } from "@/src/hooks/staff/useStaffAttendanceHistory";
import DateRangePicker from "@/components/staff/DateRangePicker";

export default function StaffAttendancePage() {
  const {
    attendance,
    summary,
    isLoading,
    pagination,
    startDate,
    endDate,
    handleDateRangeChange,
    handlePageChange,
    resetFilters,
  } = useStaffAttendanceHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return "—";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLateDuration = (totalMinutes: number) => {
    const hrs = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hrs === 0) return `+${mins} min`;
    return mins > 0 ? `+${hrs} hr ${mins} min` : `+${hrs} hr`;
  };

  const getStatusBadge = (
    status: string,
    isLate: boolean,
    lateMinutes: number
  ) => {
    if (status === "absent") {
      return (
        <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-rose-600 bg-rose-50 border border-rose-100">
          Absent
        </span>
      );
    }
    if (isLate) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-amber-600 bg-amber-50 border border-amber-100">
            Late
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-500">
            {formatLateDuration(lateMinutes)}
          </span>
        </div>
      );
    }
    return (
      <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-100">
        Present
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <StaffNavbar />

      {/* Simplified Header Block Panel — Removed Text Elements */}
      <div className="w-full bg-[#0F0F11] pt-10 pb-24 border-b border-neutral-900" />

      {/* Main Content Stage Canvas */}
      <div className="w-full max-w-[1600px] mx-auto px-6 pb-16 flex-1 -mt-12 space-y-6">
        {/* Date Range Filter Panel */}
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-xs">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => handleDateRangeChange(date, endDate)}
            onEndDateChange={(date) => handleDateRangeChange(startDate, date)}
            onReset={resetFilters}
          />
        </div>

        {/* Global Loading State Handlers */}
        {isLoading && attendance.length === 0 && (
          <div className="border border-slate-200 bg-white p-16 text-center rounded-lg shadow-xs flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            <span className="text-xs font-medium text-slate-500">
              Syncing database log history...
            </span>
          </div>
        )}

        {/* Summary Metric Counters */}
        {!isLoading && summary.totalDays > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Tracked Days
              </span>
              <p className="text-2xl font-bold text-slate-800 mt-1">
                {summary.totalDays}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Present Status
              </span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {summary.presentDays}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Absent Outages
              </span>
              <p className="text-2xl font-bold text-rose-600 mt-1">
                {summary.absentDays}
              </p>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Late Arrival Marks
              </span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {summary.lateDays}
              </p>
            </div>
          </div>
        )}

        {/* Attendance Main Ledger Block */}
        {!isLoading && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
            {attendance.length === 0 ? (
              <div className="text-center py-16 bg-white">
                <Calendar className="h-8 w-8 text-slate-300 mx-auto mb-2 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-800">
                  No attendance references recorded
                </p>
                {(startDate || endDate) && (
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Try modifying your active range filter criteria.
                  </p>
                )}
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Log Calendar Date
                        </th>
                        <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Check In Timestamp
                        </th>
                        <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Check Out Timestamp
                        </th>
                        <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Status State
                        </th>
                        <th className="px-6 py-3.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Deployment Branch
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {attendance.map((record) => (
                        <tr
                          key={record.id}
                          className="hover:bg-slate-50/40 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-3.5 w-3.5 text-slate-300" />
                              <span>{formatDate(record.date)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-300" />
                              <span>{formatTime(record.checkInTime)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-mono text-slate-600">
                            <div className="flex items-center gap-2">
                              <Clock className="h-3.5 w-3.5 text-slate-300" />
                              <span>{formatTime(record.checkOutTime)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(
                              record.status,
                              record.isLate,
                              record.lateMinutes
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-3.5 w-3.5 text-slate-300" />
                              <span>{record.branch?.name || "—"}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls Block */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      <ChevronLeft className="h-3.5 w-3.5" />
                      <span>Previous</span>
                    </button>
                    <span className="text-xs font-medium text-slate-500">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
