// app/admin/staff/page.tsx
"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import StaffTable from "@/components/admin/StaffTable";
import ViewStaffModal from "@/components/admin/ViewStaffModal";
import EditStaffModal from "@/components/admin/EditStaffModal";
import DeleteStaffModal from "@/components/admin/DeleteStaffModal";
import { useStaffManagement } from "@/src/hooks/useStaffManagement";

export default function StaffPage() {
  const {
    staff,
    departments,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalStaff,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedStaff,
    isSubmitting,
    setCurrentPage,
    handleView,
    handleEdit,
    handleDelete,
    confirmDelete,
    confirmUpdate,
    handleSearch,
    closeViewModal,
    closeEditModal,
    closeDeleteModal,
  } = useStaffManagement();

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
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
          onDelete={handleDelete}
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
        isSubmitting={isSubmitting}
        onSubmit={confirmUpdate}
      />

      <DeleteStaffModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        staff={selectedStaff}
        isSubmitting={isSubmitting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
