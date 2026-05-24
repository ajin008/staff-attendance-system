// components/admin/AdminNavbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/src/services/auth.service";
import { getErrorMessage } from "@/src/utils/axios";
import { useDepartmentModal } from "@/src/hooks/useDepartmentModal";
import { useStaffModal } from "@/src/hooks/useStaffModal";
import { useAuth } from "@/src/context/AuthContext";
import DepartmentModal from "./DepartmentModal";
import StaffModal from "./StaffModal";

export default function AdminNavbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      logout();
      toast.success("Logged out successfully");
      window.location.href = "/login";
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto">
          {/* Left side - Company name */}
          <div className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-400/60 group-hover:bg-emerald-500 transition-colors duration-300"></div>
            </div>
            <span className="text-lg font-medium tracking-tight text-slate-800 group-hover:text-slate-900 transition-colors duration-200">
              Pulse
            </span>
            <span className="text-xs font-mono text-slate-400 pl-1 hidden sm:inline">
              / admin
            </span>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center gap-3">
            {/* Add Staff Button */}
            <button
              onClick={openStaffModal}
              className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] group"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-300 bg-slate-50 group-hover:bg-slate-100 scale-105" />
              <span className="relative flex items-center gap-2 text-slate-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                <span>staff</span>
              </span>
            </button>

            {/* Add Department Button */}
            <button
              onClick={openDeptModal}
              className="relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-[0.98] active:scale-[0.96] group"
            >
              <span className="absolute inset-0 rounded-full transition-all duration-300 bg-slate-50 group-hover:bg-slate-100 scale-105" />
              <span className="relative flex items-center gap-2 text-slate-700">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
                <span>department</span>
              </span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className={`
                relative px-5 py-2 rounded-full text-sm font-medium
                transition-all duration-300 ease-out
                ${
                  isLoggingOut
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-[0.98] active:scale-[0.96]"
                }
              `}
            >
              <span
                className={`
                  absolute inset-0 rounded-full transition-all duration-500
                  ${
                    isHovering && !isLoggingOut
                      ? "bg-red-50 scale-110"
                      : "bg-transparent"
                  }
                `}
              />
              <span
                className={`
                  absolute inset-0 rounded-full border transition-all duration-300
                  ${
                    isHovering && !isLoggingOut
                      ? "border-red-200 opacity-0"
                      : "border-slate-200 opacity-100"
                  }
                `}
              />
              <span className="relative flex items-center gap-2 text-slate-600">
                {isLoggingOut ? (
                  <>
                    <svg
                      className="h-3.5 w-3.5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>signing out</span>
                  </>
                ) : (
                  <>
                    <span className="text-base leading-none">→</span>
                    <span>exit</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Subtle organic line at bottom */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent"></div>
      </div>

      {/* Department Modal */}
      <DepartmentModal
        isOpen={isDeptOpen}
        onClose={closeDeptModal}
        onSubmit={handleCreateDepartment}
        isSubmitting={isDeptSubmitting}
      />

      {/* Staff Modal */}
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
