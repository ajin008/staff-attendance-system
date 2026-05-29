// components/admin/StaffTable.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Edit2,
  UserX,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { Staff, Department } from "@/src/types";

interface StaffTableProps {
  staff: Staff[];
  departments: Department[];
  isLoading: boolean;
  searchTerm: string;
  currentPage: number;
  totalPages: number;
  totalStaff: number;
  onView: (staff: Staff) => void;
  onEdit: (staff: Staff) => void;
  onStatusToggle: (staff: Staff) => void;
  onSearch: (term: string) => void;
  onPageChange: (page: number) => void;
}

export default function StaffTable({
  staff,
  departments,
  isLoading,
  searchTerm,
  currentPage,
  totalPages,
  totalStaff,
  onView,
  onEdit,
  onStatusToggle,
  onSearch,
  onPageChange,
}: StaffTableProps) {
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

  const getDepartmentName = (department?: { id: number; name: string }) => {
    return department?.name || "—";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-4 antialiased">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push("/admin")}
            className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>back to dashboard</span>
          </button>

          <button
            onClick={() => router.push("/admin/departments")}
            className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 bg-slate-50 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-colors"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>manage departments</span>
          </button>
        </div>

        <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200/60">
                <tr>
                  {[
                    "Staff ID",
                    "Name Identity",
                    "Email Anchor",
                    "Sector Node",
                    "Registry Link",
                    "Contact Vector",
                    "Status",
                    "Execution Operations",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-100 animate-pulse"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 bg-slate-100 rounded-sm w-24"></div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 antialiased">
      {/* Upper Matrix Control Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/admin")}
          className="flex items-center gap-1.5 text-[11px] font-mono uppercase font-bold text-slate-400 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>back to dashboard</span>
        </button>

        <button
          onClick={() => router.push("/admin/departments")}
          className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-all"
        >
          <Building2 className="h-3.5 w-3.5" />
          <span>Sectors Overview</span>
          <span className="font-mono font-bold text-slate-400">
            / {departments.length}
          </span>
        </button>
      </div>

      {/* Input Processing Structural Search Block */}
      <form onSubmit={handleSearchSubmit} className="relative max-w-md">
        <input
          type="text"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Query by index name, email link or staff ID parameters..."
          className="w-full px-4 py-2 pl-9 pr-9 rounded-md border border-slate-200 bg-white text-xs font-medium placeholder:text-slate-300 focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        {localSearch && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors focus:outline-none"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </form>

      {/* Filter Metadata Context Tracker */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          {searchTerm ? (
            <p>
              Found {totalStaff} Registry Entry Matches For &#34;
              <span className="text-slate-900 font-bold">{searchTerm}</span>
              &#34;
            </p>
          ) : (
            <p className="flex items-center gap-1.5">
              <Users className="h-3 w-3" />
              <span>
                {staff.length} of {totalStaff} Node Entities Allocated
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Core Structural Personnel Matrix Sheet */}
      <div className="bg-white rounded-md border border-slate-200/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200/60">
              <tr>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Staff ID
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Name Identity
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Email Anchor
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Sector Node
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Registry Link
                </th>
                <th className="px-5 py-3 text-left text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Contact Vector
                </th>
                <th className="px-5 py-3 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-center text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Execution Operations
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-600">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <div className="space-y-1.5">
                      <p className="text-xs text-slate-400 font-medium">
                        No system tracking arrays matched parameters
                      </p>
                      {searchTerm && (
                        <button
                          onClick={handleClearSearch}
                          className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 underline underline-offset-2"
                        >
                          Reset Processing Query
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                staff.map((member) => (
                  <tr
                    key={member.id}
                    className={`border-b border-slate-100 hover:bg-slate-50/40 transition-colors ${
                      !member.isActive ? "bg-slate-50/30" : ""
                    }`}
                  >
                    <td className="px-5 py-3.5 font-mono text-slate-900 font-bold">
                      {member.staffId}
                    </td>
                    <td className="px-5 py-3.5 text-slate-900 font-bold uppercase tracking-tight">
                      {member.name}
                      {!member.isActive && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-700 uppercase">
                          Resigned
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 font-mono">
                      {member.email}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-slate-100 border border-slate-200/50 text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                        <Building2 className="h-2.5 w-2.5 text-slate-400" />
                        {getDepartmentName(member.department)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-300" />
                        <span>
                          {formatDate(member.joinedOn || member.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500">
                      {member.phone || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          member.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {member.isActive ? (
                          <>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </>
                        ) : (
                          <>
                            <UserX className="h-2.5 w-2.5" />
                            Resigned
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Process Logging Parameters Tracker Hook */}
                        <button
                          onClick={() =>
                            router.push(
                              `/admin/staff/${member.staffId}/attendance`
                            )
                          }
                          className="flex items-center gap-1 px-2 py-1 rounded-sm text-[10px] font-mono font-bold uppercase tracking-tight bg-slate-900 text-white border border-slate-950 transition-colors hover:bg-slate-800"
                          title="Verify Log Records Matrix"
                          disabled={!member.isActive}
                        >
                          <Clock className="h-3 w-3" />
                          <span>logs</span>
                        </button>

                        {/* View Processing Vector */}
                        <button
                          onClick={() => onView(member)}
                          className="p-1.5 border border-slate-200 rounded-md text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all"
                          title="Open Inspection View"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>

                        {/* Edit Structural Variables */}
                        <button
                          onClick={() => onEdit(member)}
                          className="p-1.5 border border-slate-200 rounded-md text-slate-500 hover:text-amber-700 hover:bg-amber-50 transition-all"
                          title="Modify Local Matrix Properties"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        {/* Status Toggle - Resign/Activate */}
                        <button
                          onClick={() => onStatusToggle(member)}
                          className={`p-1.5 border rounded-md transition-all ${
                            member.isActive
                              ? "border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                              : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                          }`}
                          title={
                            member.isActive
                              ? "Mark as Resigned"
                              : "Activate Employee"
                          }
                        >
                          {member.isActive ? (
                            <UserX className="h-3.5 w-3.5" />
                          ) : (
                            <UserCheck className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Dynamic Matrix Control Navigation Panel */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200/60 bg-slate-50/40 font-mono text-xs">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-0.5 px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Prev Matrix</span>
            </button>
            <span className="text-[11px] font-bold text-slate-500">
              [ Page {currentPage} of {totalPages} ]
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-0.5 px-2.5 py-1 rounded-md text-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed hover:bg-slate-100 hover:text-slate-900 transition-colors focus:outline-none"
            >
              <span>Next Matrix</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
