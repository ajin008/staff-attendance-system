// app/admin/staff/page.tsx
"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import StaffTable from "@/components/admin/StaffTable";
import ViewStaffModal from "@/components/admin/ViewStaffModal";
import EditStaffModal from "@/components/admin/EditStaffModal";
import StatusToggleModal from "@/components/staff/StatusToggleModal";
import { useStaffManagement } from "@/src/hooks/useStaffManagement";

export default function StaffPage() {
  const {
    staff,
    departments,
    branches,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalStaff,
    statusFilter,
    isViewModalOpen,
    isEditModalOpen,
    isStatusModalOpen,
    selectedStaff,
    isSubmitting,
    setCurrentPage,
    setStatusFilter,
    handleView,
    handleEdit,
    handleStatusToggle,
    confirmStatusToggle,
    confirmUpdate,
    handleSearch,
    closeViewModal,
    closeEditModal,
    closeStatusModal,
  } = useStaffManagement();

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <div className="max-w-400 mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            04 — Directory
          </p>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Employees
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            manage your team members
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "all"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("active")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "active"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setStatusFilter("resigned")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              statusFilter === "resigned"
                ? "text-slate-900 border-b-2 border-slate-900"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Resigned
          </button>
        </div>

        <StaffTable
          staff={staff}
          departments={departments}
          isLoading={isLoading}
          searchTerm={searchTerm}
          currentPage={currentPage}
          totalPages={totalPages}
          totalStaff={totalStaff}
          onView={handleView}
          onEdit={handleEdit}
          onStatusToggle={handleStatusToggle}
          onSearch={handleSearch}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <ViewStaffModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        staff={selectedStaff}
        departments={departments}
      />

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        staff={selectedStaff}
        departments={departments}
        branches={branches}
        isSubmitting={isSubmitting}
        onSubmit={confirmUpdate}
      />

      <StatusToggleModal
        isOpen={isStatusModalOpen}
        onClose={closeStatusModal}
        staff={selectedStaff}
        isSubmitting={isSubmitting}
        onConfirm={confirmStatusToggle}
      />
    </div>
  );
}
