// components/admin/ViewDepartmentModal.tsx
"use client";

import {
  Clock,
  DollarSign,
  Calendar,
  Building2,
  Zap,
  Timer,
} from "lucide-react";
import type { Department } from "@/src/types";
import Modal from "../ui/Modal";

interface ViewDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  department: Department | null;
}

export default function ViewDepartmentModal({
  isOpen,
  onClose,
  department,
}: ViewDepartmentModalProps) {
  if (!department) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Department Details"
      size="md"
    >
      <div className="space-y-5">
        {/* Department Name */}
        <div className="text-center pb-3 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
            <Building2 className="h-8 w-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-medium text-slate-800">
            {department.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">ID: {department.id}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Shift Hours</p>
              <p className="text-sm text-slate-700">
                {department.shiftStart} — {department.shiftEnd}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Default Salary</p>
              <p className="text-sm text-slate-700">
                Rs {department.defaultSalary.toLocaleString()}/month
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Overtime</p>
              <p className="text-sm text-slate-700">
                {department.overtimeEnabled ? "Enabled" : "Disabled"}
              </p>
            </div>
          </div>

          {department.overtimeEnabled && (
            <>
              <div className="flex items-start gap-2">
                <Timer className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Grace Minutes</p>
                  <p className="text-sm text-slate-700">
                    {department.overtimeGraceMins} mins
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-400">Overtime Rate</p>
                  <p className="text-sm text-slate-700">
                    ₹{department.overtimeHourlyRate?.toLocaleString()}/hour
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Created</p>
              <p className="text-sm text-slate-700">
                {new Date(department.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-700 hover:bg-slate-50 border border-slate-200 transition-colors"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
