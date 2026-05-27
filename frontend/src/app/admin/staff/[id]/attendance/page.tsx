// app/admin/staff/[id]/attendance/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  User,
  Building2,
  Loader2,
} from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useStaffAttendance } from "@/src/hooks/adim-staff-attendence/useStaffAttendance";
import DateRangePicker from "@/components/admin/attendence/DateRangePicker";

export default function StaffAttendancePage() {
  const params = useParams();
  const router = useRouter();
  const staffId = params.id as string;

  const {
    attendance,
    staffInfo,
    isLoading,
    error,
    pagination,
    startDate,
    endDate,
    handleDateRangeChange,
    handlePageChange,
    resetDateFilter,
  } = useStaffAttendance({ staffId });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (timeString?: string | null) => {
    if (!timeString) return "—";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (
    status: string,
    isLate: boolean,
    lateMinutes: number
  ) => {
    if (status === "absent") {
      return (
        <span className="px-2 py-1 rounded-full text-xs bg-rose-50 text-rose-600">
          Absent
        </span>
      );
    }
    if (isLate) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="px-2 py-1 rounded-full text-xs bg-amber-50 text-amber-600">
            Late
          </span>
          <span className="text-[10px] text-amber-500">+{lateMinutes} min</span>
        </div>
      );
    }
    return (
      <span className="px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-600">
        Present
      </span>
    );
  };

  if (isLoading && attendance.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/admin/staff")}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to staff directory</span>
        </button>

        {/* Staff Info Header */}
        {staffInfo && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1 h-6 bg-emerald-400 rounded-full" />
              <span className="text-[11px] font-mono text-emerald-500 tracking-wider">
                ATTENDANCE HISTORY
              </span>
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-light tracking-tight text-slate-800">
                  {staffInfo.name}
                </h1>
                <div className="flex items-center gap-4 mt-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {staffInfo.staffId}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm text-slate-500">
                      {staffInfo.department?.name || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Picker */}
        <div className="mb-6">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => handleDateRangeChange(date, endDate)}
            onEndDateChange={(date) => handleDateRangeChange(startDate, date)}
            onReset={resetDateFilter}
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 text-center mb-6">
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        )}

        {/* Attendance Table */}
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          {attendance.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No attendance records found</p>
              {(startDate || endDate) && (
                <p className="text-xs text-slate-400 mt-1">
                  for selected date range
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check In
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Check Out
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Branch
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {attendance.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-300" />
                            <span className="text-sm text-slate-700">
                              {formatDate(record.date)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-300" />
                            <span className="text-sm font-mono text-slate-600">
                              {formatTime(record.checkInTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-300" />
                            <span className="text-sm font-mono text-slate-600">
                              {formatTime(record.checkOutTime)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(
                            record.status,
                            record.isLate,
                            record.lateMinutes
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-300" />
                            <span className="text-sm text-slate-600">
                              {record.branch?.name || "—"}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="px-3 py-1.5 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-slate-500">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="px-3 py-1.5 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Summary Stats */}
        {attendance.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Total Days</p>
              <p className="text-2xl font-light text-slate-800">
                {pagination.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Present</p>
              <p className="text-2xl font-light text-emerald-600">
                {attendance.filter((a) => a.status !== "absent").length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Absent</p>
              <p className="text-2xl font-light text-rose-600">
                {attendance.filter((a) => a.status === "absent").length}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-4">
              <p className="text-xs text-slate-400 mb-1">Late Arrivals</p>
              <p className="text-2xl font-light text-amber-600">
                {attendance.filter((a) => a.isLate).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
