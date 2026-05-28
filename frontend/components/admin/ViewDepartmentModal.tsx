// components/admin/ViewDepartmentModal.tsx
"use client";

import { Clock, Calendar, Building2, Zap, Timer } from "lucide-react";
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
      title="Department Specifications"
      size="md"
    >
      <div className="space-y-5 antialiased">
        {/* Flat Node Header Block */}
        <div className="text-center pb-4 border-b border-slate-200/60">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-slate-50 border border-slate-200/60 mb-2">
            <Building2 className="h-5 w-5 text-slate-900" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">
            {department.name}
          </h3>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">
            NODE ID: {department.id}
          </p>
        </div>

        {/* Structural Matrix Information Grid */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3.5">
          <div className="flex items-start gap-2.5">
            <Clock className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Shift Window
              </p>
              <p className="text-xs font-mono font-bold text-slate-800">
                {department.shiftStart} — {department.shiftEnd}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="text-xs font-mono font-bold text-slate-400 mt-0.5 h-3.5 w-3.5 flex items-center justify-center">
              ₹
            </div>
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Base Salary Scale
              </p>
              <p className="text-xs font-mono font-bold text-slate-800">
                ₹{department.defaultSalary.toLocaleString("en-IN")}/month
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Zap className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Overtime Processing
              </p>
              <p className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                {department.overtimeEnabled
                  ? "Active Status"
                  : "Inactive Sector"}
              </p>
            </div>
          </div>

          {department.overtimeEnabled && (
            <>
              <div className="flex items-start gap-2.5">
                <Timer className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Grace Boundary
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    {department.overtimeGraceMins} Mins
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="text-xs font-mono font-bold text-slate-400 mt-0.5 h-3.5 w-3.5 flex items-center justify-center">
                  ₹
                </div>
                <div>
                  <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    Overtime Matrix Rate
                  </p>
                  <p className="text-xs font-mono font-bold text-slate-800">
                    ₹{department.overtimeHourlyRate?.toLocaleString("en-IN")}
                    /hour
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="flex items-start gap-2.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                Registry Initialized
              </p>
              <p className="text-xs font-mono text-slate-500">
                {new Date(department.createdAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls Frame Footer */}
        <button
          onClick={onClose}
          className="w-full mt-2 px-4 py-2 border border-slate-200 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all focus:outline-none"
        >
          Close Specification View
        </button>
      </div>
    </Modal>
  );
}
