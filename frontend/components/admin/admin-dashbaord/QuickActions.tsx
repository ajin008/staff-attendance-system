// components/admin/admin-dashboard/QuickActions.tsx
"use client";

import { Users, Building2, MoreHorizontal } from "lucide-react";
import { useDepartmentModal } from "@/src/hooks/useDepartmentModal";
import { useStaffModal } from "@/src/hooks/useStaffModal";
import DepartmentModal from "../DepartmentModal";
import StaffModal from "../StaffModal";

export default function QuickActions() {
  const {
    isOpen: isDeptOpen,
    isSubmitting: isDeptSubmitting,
    openModal: openDeptModal,
    closeModal: closeDeptModal,
    handleCreateDepartment,
  } = useDepartmentModal();

  const {
    isOpen: isStaffOpen,
    isSubmitting: isStaffSubmitting,
    isLoadingDepartments,
    isLoadingBranches,
    departments,
    branches,
    openModal: openStaffModal,
    closeModal: closeStaffModal,
    handleCreateStaff,
  } = useStaffModal();

  return (
    <>
      <div className="flex flex-col gap-4 h-full">
        {/* Staff Card Workspace */}
        <div className="flex flex-col justify-between p-5 h-[156px] bg-white rounded-[22px] border border-slate-100/80 hover:shadow-sm transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm text-slate-900 tracking-tight">
                Staff Workspace
              </h4>
              <p className="text-[11px] font-medium text-slate-400">
                Onboard new enterprise profiles
              </p>
            </div>
            <button className="flex items-center justify-center w-7 h-5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100/60 transition-colors">
              <MoreHorizontal className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openStaffModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F0F11] hover:bg-slate-800 text-white text-xs font-medium transition-all duration-200 shadow-xs hover:scale-[0.99]"
            >
              <Users className="h-3 w-3" />
              <span>Add Staff</span>
            </button>
          </div>
        </div>

        {/* Department Card Workspace */}
        <div className="flex flex-col justify-between p-5 h-[156px] bg-white rounded-[22px] border border-slate-100/80 hover:shadow-sm transition-all duration-300">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold text-sm text-slate-900 tracking-tight">
                Departments
              </h4>
              <p className="text-[11px] font-medium text-slate-400">
                Structure functional core layers
              </p>
            </div>
            <button className="flex items-center justify-center w-7 h-5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-100/60 transition-colors">
              <MoreHorizontal className="h-3 w-3 text-slate-400" />
            </button>
          </div>

          <div className="flex justify-end">
            <button
              onClick={openDeptModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0F0F11] hover:bg-slate-800 text-white text-xs font-medium transition-all duration-200 shadow-xs hover:scale-[0.99]"
            >
              <Building2 className="h-3 w-3" />
              <span>Add Department</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Core Modals */}
      <DepartmentModal
        isOpen={isDeptOpen}
        onClose={closeDeptModal}
        onSubmit={handleCreateDepartment}
        isSubmitting={isDeptSubmitting}
      />

      <StaffModal
        isOpen={isStaffOpen}
        onClose={closeStaffModal}
        onSubmit={handleCreateStaff}
        isSubmitting={isStaffSubmitting}
        departments={departments}
        branches={branches}
        isLoadingDepartments={isLoadingDepartments}
        isLoadingBranches={isLoadingBranches}
      />
    </>
  );
}
