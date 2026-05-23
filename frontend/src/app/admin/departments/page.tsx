// app/admin/departments/page.tsx
"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import DepartmentTable from "@/components/admin/DepartmentTable";
import ViewDepartmentModal from "@/components/admin/ViewDepartmentModal";
import EditDepartmentModal from "@/components/admin/EditDepartmentModal";
import DeleteDepartmentModal from "@/components/admin/DeleteDepartmentModal";
import { useDepartmentManagement } from "@/src/hooks/useDepartmentManagement";

export default function DepartmentsPage() {
  const {
    departments,
    isLoading,
    searchTerm,
    currentPage,
    totalPages,
    totalDepartments,
    isViewModalOpen,
    isEditModalOpen,
    isDeleteModalOpen,
    selectedDepartment,
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
  } = useDepartmentManagement();

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        <div className="mb-6">
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-2">
            03 — Organization
          </p>
          <h1 className="text-2xl font-light tracking-tight text-slate-800">
            Departments
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            manage your organization&apos;s departments
          </p>
        </div>

        <DepartmentTable
          departments={departments}
          isLoading={isLoading}
          searchTerm={searchTerm}
          currentPage={currentPage}
          totalPages={totalPages}
          totalDepartments={totalDepartments}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSearch={handleSearch}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modals */}
      <ViewDepartmentModal
        isOpen={isViewModalOpen}
        onClose={closeViewModal}
        department={selectedDepartment}
      />

      <EditDepartmentModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        department={selectedDepartment}
        isSubmitting={isSubmitting}
        onSubmit={confirmUpdate}
      />

      <DeleteDepartmentModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        department={selectedDepartment}
        isSubmitting={isSubmitting}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
