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

  // Helper function to convert minutes into structural hour/minute format
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
        <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-rose-50 border border-rose-200/60 text-rose-700 text-[10px] font-mono uppercase font-bold tracking-tight">
          Absent
        </span>
      );
    }
    if (isLate) {
      return (
        <div className="flex flex-col items-start gap-0.5">
          <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-amber-50 border border-amber-200/60 text-amber-700 text-[10px] font-mono uppercase font-bold tracking-tight">
            Late
          </span>
          <span className="text-[10px] font-mono font-bold text-amber-600">
            {formatLateDuration(lateMinutes)}
          </span>
        </div>
      );
    }
    return (
      <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-slate-900 text-white text-[10px] font-mono uppercase font-bold tracking-tight">
        Present
      </span>
    );
  };

  if (isLoading && attendance.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-5 w-5 animate-spin text-slate-900" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-[1600px] mx-auto px-6 py-8 antialiased">
        {/* Structural Back Tracker Navigation Link */}
        <button
          onClick={() => router.push("/admin/staff")}
          className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>back to staff directory</span>
        </button>

        {/* Staff Info Header Node Block */}
        {staffInfo && (
          <div className="mb-8 border-b border-slate-200/60 pb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm tracking-wider">
                LOG MATRIX
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
                Attendance Registry
              </span>
            </div>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
                  {staffInfo.name}
                </h1>
                <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      ID:{" "}
                      <span className="font-bold text-slate-700">
                        {staffInfo.staffId}
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>
                      Sector:{" "}
                      <span className="font-bold text-slate-700">
                        {staffInfo.department?.name || "—"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Date Range Picker Grid Anchor */}
        <div className="mb-6 max-w-xl">
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={(date) => handleDateRangeChange(date, endDate)}
            onEndDateChange={(date) => handleDateRangeChange(startDate, date)}
            onReset={resetDateFilter}
          />
        </div>

        {/* Error State Block */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-md p-4 text-center mb-6">
            <p className="text-xs font-medium text-rose-600">{error}</p>
          </div>
        )}

        {/* Attendance Informational Matrix Sheet */}
        <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
          {attendance.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Calendar className="h-8 w-8 text-slate-300 mx-auto" />
              <p className="text-xs font-medium text-slate-400">
                No active logging arrays written
              </p>
              {(startDate || endDate) && (
                <p className="text-[10px] font-mono text-slate-400 uppercase">
                  [ Boundary parameters outside filter coordinates ]
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200/60">
                    <tr>
                      <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Date Window
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Check In Index
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Check Out Index
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Validation Status
                      </th>
                      <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Branch Core
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
                    {attendance.map((record) => (
                      <tr
                        key={record.id}
                        className="hover:bg-slate-50/40 transition-colors"
                      >
                        <td className="px-5 py-3.5 font-mono text-slate-900 font-bold">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            <span>{formatDate(record.date)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-700">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{formatTime(record.checkInTime)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 font-mono text-slate-700">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5 text-slate-400" />
                            <span>{formatTime(record.checkOutTime)}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {getStatusBadge(
                            record.status,
                            record.isLate,
                            record.lateMinutes
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-800 font-semibold">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-slate-400" />
                            <span>{record.branch?.name || "—"}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Structural Grid Allocation Navigation Panel */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/60 bg-slate-50/40 font-mono text-xs">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
                  >
                    ← Prev Matrix
                  </button>
                  <span className="text-[11px] font-bold text-slate-500">
                    [ Page {pagination.page} {pagination.totalPages} ]
                  </span>
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
                  >
                    Next Matrix →
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Structural Macro Metrics Summary Grid */}
        {attendance.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-md border border-slate-200/70 p-4">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Total Logs Processed
              </p>
              <p className="text-xl font-mono font-bold text-slate-900">
                {pagination.total}
              </p>
            </div>
            <div className="bg-white rounded-md border border-slate-200/70 p-4">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Present Coordinates
              </p>
              <p className="text-xl font-mono font-bold text-slate-900">
                {attendance.filter((a) => a.status !== "absent").length}
              </p>
            </div>
            <div className="bg-white rounded-md border border-slate-200/70 p-4">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Absent Exclusions
              </p>
              <p className="text-xl font-mono font-bold text-rose-600">
                {attendance.filter((a) => a.status === "absent").length}
              </p>
            </div>
            <div className="bg-white rounded-md border border-slate-200/70 p-4">
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                Late Threshold Triggers
              </p>
              <p className="text-xl font-mono font-bold text-amber-600">
                {attendance.filter((a) => a.isLate).length}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
