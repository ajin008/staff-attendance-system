"use client";

import { useStaff } from "@/src/hooks/useStaff";
import {
  Loader2,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  IdCard,
} from "lucide-react";
import { deleteStaff } from "@/src/services/auth.service";
import { toast } from "sonner";
import { useState } from "react";
import { User } from "@/src/types";
import EditStaffModal from "./EditStaffModal";

export default function StaffTable() {
  const [editingStaff, setEditingStaff] = useState<User | null>(null);
  const { data, loading, error, page, setPage, search, handleSearch, refresh } =
    useStaff();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (staffId: string, name: string) => {
    if (!confirm(`Remove ${name} from the system?`)) return;
    setDeletingId(staffId);
    try {
      await deleteStaff(staffId);
      toast.success(`${name} removed successfully`);
      refresh();
    } catch {
      toast.error("Failed to remove staff");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100">
      {/* Header */}
      <div
        className="px-6 py-5 border-b border-slate-100 flex items-center
                      justify-between gap-4 flex-wrap"
      >
        <div>
          <p className="text-xs text-slate-400 tracking-widest uppercase mb-0.5">
            04 — Directory
          </p>
          <h2 className="text-base font-semibold text-slate-900">
            Staff Members
            {data && (
              <span className="ml-2 text-xs font-normal text-slate-400">
                {data.total} total
              </span>
            )}
          </h2>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl
                        border border-slate-200 bg-slate-50 w-64"
        >
          <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <input
            placeholder="Search name, ID, email..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900
                       placeholder:text-slate-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-5 w-5 animate-spin text-slate-300" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        ) : data?.staff.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <p className="text-sm font-medium text-slate-500">
              {search ? `No results for "${search}"` : "No staff members yet"}
            </p>
            <p className="text-xs text-slate-300">
              {search
                ? "Try a different search"
                : "Create your first staff member"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.staff.map((member) => (
                <div
                  key={member._id}
                  className="group relative bg-white rounded-xl border border-slate-100 
                             hover:border-slate-200 hover:shadow-sm transition-all
                             p-5"
                >
                  <button
                    onClick={() => setEditingStaff(member)}
                    className="absolute top-4 right-10 opacity-0 group-hover:opacity-100
             text-slate-300 hover:text-blue-500
             transition-all"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(member.staffId, member.name)}
                    disabled={deletingId === member.staffId}
                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100
                               text-slate-300 hover:text-red-500
                               transition-all disabled:opacity-50 z-10"
                  >
                    {deletingId === member.staffId ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>

                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full bg-blue-50
                                    flex items-center justify-center shrink-0"
                    >
                      <span className="text-blue-600 text-base font-bold">
                        {member.name[0].toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        {member.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <IdCard className="h-3 w-3 text-slate-400" />
                        <span
                          className="text-xs font-mono font-medium
                                       text-slate-500"
                        >
                          {member.staffId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 pt-2 border-t border-slate-50">
                    {/* Email */}
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-600 text-xs truncate">
                        {member.email}
                      </span>
                    </div>

                    {member.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <svg
                          className="h-3.5 w-3.5 text-slate-400 shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-slate-400 text-xs">
                          {member.phone}
                        </span>
                      </div>
                    )}

                    {/* Joined Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="text-slate-400 text-xs">
                        Joined{" "}
                        {new Date(member.joinedOn).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div
                className="mt-6 pt-4 border-t border-slate-100 flex items-center
                              justify-between flex-wrap gap-3"
              >
                <p className="text-xs text-slate-400">
                  Page {page} of {data.totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!data.hasPrevPage}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700
                               hover:bg-slate-100 disabled:opacity-30
                               disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: data.totalPages }, (_, i) => i + 1)
                    .filter(
                      (p) =>
                        p === 1 ||
                        p === data.totalPages ||
                        Math.abs(p - page) <= 1
                    )
                    .map((p, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span
                            key={`dots-${p}`}
                            className="text-xs text-slate-300 px-1"
                          >
                            ...
                          </span>
                        )}
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-7 h-7 rounded-lg text-xs font-medium
                                      transition-colors
                                      ${
                                        page === p
                                          ? "bg-slate-900 text-white"
                                          : "text-slate-500 hover:bg-slate-100"
                                      }`}
                        >
                          {p}
                        </button>
                      </>
                    ))}

                  <button
                    onClick={() => setPage((p) => p + 1)}
                    disabled={!data.hasNextPage}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700
                               hover:bg-slate-100 disabled:opacity-30
                               disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <EditStaffModal
        open={!!editingStaff}
        onClose={() => setEditingStaff(null)}
        staff={editingStaff}
        onUpdated={refresh}
      />
    </div>
  );
}
