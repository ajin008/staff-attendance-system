/* eslint-disable react-hooks/immutability */
// app/admin/attendance/late/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Phone, MessageCircle } from "lucide-react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { useLateAttendance } from "@/src/hooks/staff/useLateAttendance";

export default function LateAttendancePage() {
  const router = useRouter();
  const { staffList, isLoading, error, refresh } = useLateAttendance();

  const formatTime = (timeString?: string) => {
    if (!timeString) return "—";
    const date = new Date(timeString);
    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatLateMinutes = (minutes?: number) => {
    if (!minutes || minutes <= 0) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  const handlePhoneCall = (phoneNumber: string) => {
    if (!phoneNumber) return;
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleWhatsApp = (phoneNumber: string, name: string) => {
    if (!phoneNumber) return;
    const cleanNumber = phoneNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Hello ${name}, this is a reminder about your late check-in today. Please ensure you're on time for your shift.`
    );
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <AdminNavbar />
        <div className="max-w-400 mx-auto px-6 py-8">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>back to dashboard</span>
          </button>
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100 text-center">
            <p className="text-sm text-rose-600">{error}</p>
            <button
              onClick={refresh}
              className="mt-3 text-xs text-rose-500 hover:text-rose-700 underline"
            >
              try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="max-w-400 mx-auto px-6 py-8">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>back to dashboard</span>
        </button>

        <div className="mb-6">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            03 — Attendance
          </p>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Late Check-in
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Staff members who checked in after shift start
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          {staffList.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-400">No late check-ins today</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Staff ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Check In
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Late By
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffList.map((staff) => (
                    <tr
                      key={staff.id}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="text-sm font-mono text-slate-600">
                          {staff.staffId}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-slate-800">
                          {staff.name}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">{staff.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        {staff.phone ? (
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-slate-700 font-medium">
                              {staff.phone}
                            </span>
                            <div className="flex items-center gap-1.5">
                              {/* Call Button */}
                              <button
                                onClick={() => handlePhoneCall(staff.phone)}
                                className="p-1.5 rounded-md bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 hover:border-green-300 transition-all"
                                title="Call"
                              >
                                <Phone className="h-4 w-4" />
                              </button>
                              {/* WhatsApp Button */}
                              <button
                                onClick={() =>
                                  handleWhatsApp(staff.phone, staff.name)
                                }
                                className="p-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all"
                                title="WhatsApp"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600">
                          {formatTime(staff.checkInTime)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                          {formatLateMinutes(staff.lateMinutes)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
