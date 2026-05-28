// app/admin/departments/page.tsx
"use client";

import AdminNavbar from "@/components/admin/AdminNavbar";
import DepartmentTable from "@/components/admin/DepartmentTable";
import ViewDepartmentModal from "@/components/admin/ViewDepartmentModal";
import EditDepartmentModal from "@/components/admin/EditDepartmentModal";
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
    selectedDepartment,
    isSubmitting,
    setCurrentPage,
    handleView,
    handleEdit,
    handleToggleStatus,
    confirmUpdate,
    handleSearch,
    closeViewModal,
    closeEditModal,
  } = useDepartmentManagement();

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />

      <div className="max-w-400 mx-auto px-6 py-8">
        <div className="mb-6 border-b border-slate-200/60 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-mono font-bold bg-slate-900 text-white px-1.5 py-0.5 rounded-sm tracking-wider">
              STRUCTURE MATRIX
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">
              Infrastructure Sectors
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
            Departments Registry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure system structural parameters, global defaults, and
            micro-shift assignment coordinates.
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
          onToggleStatus={handleToggleStatus}
          onSearch={handleSearch}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Specification Modals Mapping Grid */}
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
    </div>
  );
}
