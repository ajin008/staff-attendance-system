// components/admin/ViewStaffModal.tsx
"use client";

import {
  Mail,
  Phone,
  Building2,
  Calendar,
  Hash,
  Briefcase,
} from "lucide-react";
import type { Staff, Department } from "@/src/types";
import Modal from "../ui/Modal";

interface ViewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: Staff | null;
  departments: Department[];
}

export default function ViewStaffModal({
  isOpen,
  onClose,
  staff,
  departments,
}: ViewStaffModalProps) {
  if (!staff) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" size="md">
      <div className="space-y-5">
        {/* Name & Staff ID */}
        <div className="text-center pb-3 border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-3">
            <span className="text-2xl font-light text-slate-600">
              {staff.name?.charAt(0) || "?"}
            </span>
          </div>
          <h3 className="text-lg font-medium text-slate-800">{staff.name}</h3>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            {staff.staffId}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-2">
            <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Email</p>
              <p className="text-sm text-slate-700">{staff.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Phone</p>
              <p className="text-sm text-slate-700">{staff.phone || "—"}</p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Building2 className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Department</p>
              <p className="text-sm text-slate-700">
                {staff.department?.name || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Briefcase className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Branch</p>
              <p className="text-sm text-slate-700">{staff.branch || "—"}</p>
            </div>
          </div>

          {/* <div className="flex items-start gap-2">
            <Hash className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Employee ID</p>
              <p className="text-sm font-mono text-slate-700">{staff.id}</p>
            </div>
          </div> */}

          <div className="flex items-start gap-2">
            <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
            <div>
              <p className="text-xs text-slate-400">Joined</p>
              <p className="text-sm text-slate-700">
                {staff.createdAt
                  ? new Date(staff.createdAt).toLocaleDateString()
                  : "—"}
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
