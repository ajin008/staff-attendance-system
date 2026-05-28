/* eslint-disable react-hooks/set-state-in-effect */
// components/admin/DepartmentTable.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ArrowLeft,
  Clock,
  ToggleLeft,
  ToggleRight,
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
  onToggleStatus: (department: Department) => void;
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
  onToggleStatus,
  onSearch,
  onPageChange,
}: DepartmentTableProps) {
  const router = useRouter();
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
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
      <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200/60">
              <tr>
                {[
                  "Department Name",
                  "Shift Window",
                  "Default Salary Base",
                  "Overtime Status",
                  "Operational State",
                  "Created On",
                  "Execution Operations",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="border-b border-slate-100 animate-pulse">
                  {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                    <td key={j} className="px-5 py-4">
                      <div className="h-3 bg-slate-100 rounded-sm w-24" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 antialiased">
      {/* Structural Back Tracker Navigation Link */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>back to control dashboard</span>
      </button>

      {/* Wireframe Flat Input Search Vector Field Component */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Filter registry by department key..."
          className="w-full px-3.5 py-2 pl-9 pr-9 rounded-md border border-slate-200 bg-white text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:border-slate-900 transition-colors"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        {localSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600 transition-colors focus:outline-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Grid Meta Information Counters Context Bar */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-mono text-slate-400">
          {searchTerm ? (
            <>
              Found {totalDepartments} node{totalDepartments !== 1 ? "s" : ""}{" "}
              targeting &quot;
              <span className="font-bold text-slate-700">{searchTerm}</span>
              &quot;
            </>
          ) : (
            <>
              Displaying {departments.length} of {totalDepartments}{" "}
              Infrastructure Sectors
            </>
          )}
        </p>
      </div>

      {/* Core Informational Matrix Sector Sheet Grid */}
      <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Department Name
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Shift Window
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Default Salary Base
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Overtime Status
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Operational State
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Created On
                </th>
                <th className="px-5 py-3 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-slate-400">
                        No organizational segments registered
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="text-[10px] font-mono text-slate-500 hover:text-slate-900 underline uppercase"
                        >
                          Reset Registry Query
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                departments.map((dept) => (
                  <tr
                    key={dept.id}
                    className={`hover:bg-slate-50/40 transition-colors group text-xs font-medium ${
                      dept.isActive
                        ? "text-slate-600"
                        : "text-slate-400 bg-slate-50/20"
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <p
                        className={`font-bold uppercase tracking-tight ${
                          dept.isActive ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {dept.name}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {dept.shiftStart} — {dept.shiftEnd}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-mono font-bold">
                        ₹{dept.defaultSalary.toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      {dept.overtimeEnabled ? (
                        <span
                          className={`inline-flex px-1.5 py-0.5 rounded-sm text-[10px] font-mono uppercase font-bold tracking-tight border ${
                            dept.isActive
                              ? "bg-slate-900 text-white border-slate-950"
                              : "bg-slate-100 text-slate-400 border-slate-200"
                          }`}
                        >
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-slate-100 text-slate-400 text-[10px] font-mono uppercase tracking-tight border border-transparent">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {dept.isActive ? (
                        <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-mono uppercase font-bold tracking-tight">
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex px-1.5 py-0.5 rounded-sm bg-rose-50 border border-rose-200 text-rose-600 text-[10px] font-mono uppercase font-bold tracking-tight">
                          Disabled
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono">
                      {new Date(dept.createdAt).toLocaleDateString("en-IN")}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* High-Target Structural Toggle Control Badge Component */}
                        <button
                          onClick={() => onToggleStatus(dept)}
                          className={`flex items-center justify-between w-24 px-2 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-tight transition-all focus:outline-none ${
                            dept.isActive
                              ? "bg-white text-slate-500 border-slate-200 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/30"
                              : "bg-emerald-50/50 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          }`}
                          title={
                            dept.isActive
                              ? "Deactivate Department Module"
                              : "Activate Department Module"
                          }
                        >
                          <span>{dept.isActive ? "active" : "off"}</span>
                          {dept.isActive ? (
                            <ToggleRight className="h-4 w-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-emerald-600" />
                          )}
                        </button>

                        <button
                          onClick={() => onView(dept)}
                          className="p-1.5 rounded-md text-slate-400 border border-slate-200 hover:text-slate-900 hover:bg-slate-50/50 transition-all focus:outline-none"
                          title="View Node Specifications"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEdit(dept)}
                          className="p-1.5 rounded-md text-slate-400 border border-slate-200 hover:text-slate-900 hover:bg-slate-50/50 transition-all focus:outline-none"
                          title="Edit Operational Matrix"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Structural Grid Allocation Navigation Panel */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/60 bg-slate-50/40 font-mono text-xs">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Prev Matrix</span>
            </button>
            <span className="text-[11px] font-bold text-slate-500">
              [ Grid Node {currentPage} of {totalPages} ]
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            >
              <span>Next Matrix</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
