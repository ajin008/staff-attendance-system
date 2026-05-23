// components/admin/DepartmentTable.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ArrowLeft,
  Clock,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Department } from "@/src/types";

interface DepartmentTableProps {
  departments: Department[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalDepartments: number;
  onView: (department: Department) => void;
  onEdit: (department: Department) => void;
  onDelete: (department: Department) => void;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
}

export default function DepartmentTable({
  departments,
  isLoading,
  searchTerm,
  currentPage,
  totalPages,
  totalDepartments,
  onView,
  onEdit,
  onDelete,
  onSearch,
  onPageChange,
}: DepartmentTableProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalSearch(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearch);
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    onSearch("");
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {[
                  "Department Name",
                  "Shift",
                  "Default Salary",
                  "Overtime",
                  "Created",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100 animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-32"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-16"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-24"></div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 bg-slate-100 rounded w-16"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <button
        onClick={() => router.push("/admin")}
        className="group flex items-center gap-2 text-sm text-slate-400 hover:text-slate-600 transition-colors mb-2"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>back to dashboard</span>
      </button>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="search by department name..."
          className="w-full px-4 py-2.5 pl-10 pr-10 rounded-xl border border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-slate-300 focus:ring-1 focus:ring-slate-100 transition-all"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        {localSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Department Count */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-slate-400">
          {searchTerm ? (
            <>
              found {totalDepartments} result{totalDepartments !== 1 ? "s" : ""}{" "}
              for &quot;
              <span className="font-medium text-slate-500">{searchTerm}</span>
              &quot;
            </>
          ) : (
            <>
              showing {departments.length} of {totalDepartments} departments
            </>
          )}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Shift
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Default Salary
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Overtime
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-4 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="text-sm text-slate-400">
                        no departments found
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="text-xs text-slate-500 hover:text-slate-700 underline"
                        >
                          clear search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-800">
                        {dept.name}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {dept.shiftStart} — {dept.shiftEnd}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        <span>Rs {dept.defaultSalary.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {dept.overtimeEnabled ? (
                        <span className="inline-flex px-2 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-medium">
                          enabled
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                          disabled
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-500">
                        {new Date(dept.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onView(dept)}
                          className="p-2 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onEdit(dept)}
                          className="p-2 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDelete(dept)}
                          className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-all duration-200"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/30">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              previous
            </button>
            <span className="text-sm text-slate-500">
              page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 transition-colors"
            >
              next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
