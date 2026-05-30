// components/admin/ViewDepartmentModal.tsx
"use client";

import Modal from "../ui/Modal";
import type { Department } from "@/src/types";

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

const WEEKDAYS_MAP: Record<string, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

export default function ViewDepartmentModal({
  isOpen,
  onClose,
  department,
}: ViewDepartmentModalProps) {
  if (!department) return null;

  const formatWeeklyOffDays = (days: string[]) => {
    if (!days || days.length === 0) return "None";
    return days.map((day) => WEEKDAYS_MAP[day.toLowerCase()] || day).join(", ");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Department Details"
      size="md"
    >
      <div className="space-y-5">
        {/* Department Name */}
        <div className="pb-3 border-b border-slate-100">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Department Name
          </label>
          <p className="text-base font-semibold text-slate-900">
            {department.name}
          </p>
        </div>

        {/* Shift Timing */}
        <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-100">
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Shift Start
            </label>
            <p className="text-sm font-medium text-slate-800">
              {department.shiftStart}
            </p>
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Shift End
            </label>
            <p className="text-sm font-medium text-slate-800">
              {department.shiftEnd}
            </p>
          </div>
        </div>

        {/* Default Salary */}
        <div className="pb-3 border-b border-slate-100">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Default Salary
          </label>
          <p className="text-sm font-semibold text-emerald-600">
            ₹{department.defaultSalary?.toLocaleString()}/month
          </p>
        </div>

        {/* Weekly Off Days */}
        <div className="pb-3 border-b border-slate-100">
          <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Weekly Off Days
          </label>
          <div className="flex flex-wrap gap-2">
            {department.weeklyOffDays && department.weeklyOffDays.length > 0 ? (
              department.weeklyOffDays.map((day) => (
                <span
                  key={day}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-xs font-medium text-slate-700"
                >
                  {WEEKDAYS_MAP[day.toLowerCase()] || day}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-400">
                No weekly off days configured
              </span>
            )}
          </div>
        </div>

        {/* Overtime Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Overtime Enabled
            </label>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                department.overtimeEnabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {department.overtimeEnabled ? "Active" : "Disabled"}
            </span>
          </div>

          {department.overtimeEnabled && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Grace Minutes
                </label>
                <p className="text-sm font-medium text-slate-800">
                  {department.overtimeGraceMins} minutes
                </p>
              </div>
              <div>
                <label className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Hourly Rate
                </label>
                <p className="text-sm font-medium text-slate-800">
                  ₹{department.overtimeHourlyRate}/hour
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
