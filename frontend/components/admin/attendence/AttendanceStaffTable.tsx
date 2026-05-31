// components/admin/AttendanceStaffTable.tsx
"use client";

import type {
  PresentStaff,
  AbsentStaff,
  LateStaff,
} from "@/src/services/attendance.service";

type StaffItem = PresentStaff | AbsentStaff | LateStaff;

interface AttendanceStaffTableProps {
  staffList: StaffItem[];
  type: "present" | "absent" | "late";
  emptyMessage: string;
}

export default function AttendanceStaffTable({
  staffList,
  type,
  emptyMessage,
}: AttendanceStaffTableProps) {
  console.log("Rendering AttendanceStaffTable with staffList:", staffList);

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
    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    }
    return `${mins}m`;
  };

  // Type guard functions
  const isPresentStaff = (staff: StaffItem): staff is PresentStaff => {
    return type === "present" && "user" in staff && "branch" in staff;
  };

  const isAbsentStaff = (staff: StaffItem): staff is AbsentStaff => {
    return type === "absent" && "name" in staff && "email" in staff;
  };

  const isLateStaff = (staff: StaffItem): staff is LateStaff => {
    return type === "late" && "user" in staff && "lateMinutes" in staff;
  };

  // Helper to get staff name
  const getStaffName = (staff: StaffItem): string => {
    if (isAbsentStaff(staff)) {
      return staff.name;
    }
    if (isPresentStaff(staff) || isLateStaff(staff)) {
      return staff.user.name;
    }
    return "—";
  };

  // Helper to get staff ID
  const getStaffId = (staff: StaffItem): string => {
    if (isAbsentStaff(staff)) {
      return staff.staffId;
    }
    if (isPresentStaff(staff) || isLateStaff(staff)) {
      return staff.user.staffId;
    }
    return "—";
  };

  // Helper to get staff email
  const getStaffEmail = (staff: StaffItem): string => {
    if (isAbsentStaff(staff)) {
      return staff.email;
    }
    if (isPresentStaff(staff)) {
      return staff.user.email || "—";
    }
    return "—";
  };

  // Helper to get staff user ID for routing
  const getStaffUserId = (staff: StaffItem): number => {
    if (isAbsentStaff(staff)) {
      return staff.id;
    }
    if (isPresentStaff(staff) || isLateStaff(staff)) {
      return staff.user.id;
    }
    return 0;
  };

  // Helper to get check-in time (for present/late)
  const getCheckInTime = (staff: StaffItem): string | undefined => {
    if (isPresentStaff(staff) || isLateStaff(staff)) {
      return staff.checkInTime;
    }
    return undefined;
  };

  // Helper to get late status (for present)
  const getIsLate = (staff: StaffItem): boolean => {
    if (isPresentStaff(staff)) {
      return staff.isLate;
    }
    return false;
  };

  // Helper to get late minutes (for present/late)
  const getLateMinutes = (staff: StaffItem): number | undefined => {
    if (isPresentStaff(staff)) {
      return staff.lateMinutes;
    }
    if (isLateStaff(staff)) {
      return staff.lateMinutes;
    }
    return undefined;
  };

  // Helper to get branch (for present)
  const getBranch = (
    staff: StaffItem
  ): { id: number; name: string } | undefined => {
    if (isPresentStaff(staff)) {
      return staff.branch;
    }
    return undefined;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      {staffList.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-slate-400">{emptyMessage}</p>
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
                {(type === "present" || type === "late") && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Check In
                  </th>
                )}
                {type === "present" && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                )}
                {type === "late" && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Late By
                  </th>
                )}
                {type === "present" && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Branch
                  </th>
                )}
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
                      {getStaffId(staff)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {getStaffName(staff)}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600">
                      {getStaffEmail(staff)}
                    </p>
                  </td>

                  {(type === "present" || type === "late") && (
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {formatTime(getCheckInTime(staff))}
                      </p>
                    </td>
                  )}

                  {type === "present" && (
                    <td className="px-6 py-4">
                      {getIsLate(staff) ? (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs">
                          Late by {formatLateMinutes(getLateMinutes(staff))}
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs">
                          On time
                        </span>
                      )}
                    </td>
                  )}

                  {type === "late" && (
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs">
                        {formatLateMinutes(getLateMinutes(staff))}
                      </span>
                    </td>
                  )}

                  {type === "present" && (
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {getBranch(staff)?.name || "—"}
                      </p>
                    </td>
                  )}

                  {/* <td className="px-6 py-4">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() =>
                          router.push(`/admin/staff/${getStaffUserId(staff)}`)
                        }
                        className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        title="View Staff"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
