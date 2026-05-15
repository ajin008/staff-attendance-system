"use client";

import { useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { logoutUser } from "@/src/services/auth.service";
import { useRouter, usePathname } from "next/navigation";
import CreateStaffModal from "./CreateStaffModal";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      logout();
      router.replace("/login");
    } catch {
      logout();
      router.replace("/login");
    }
  };

  const tabs = [
    { label: "Overview", href: "/admin" },
    { label: "Employees", href: "/admin/employees" },
  ];

  return (
    <>
      <nav className="border-b border-slate-100 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8">
          {/* Top row */}
          <div className="h-14 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                Admin Dashboard
              </span>
              <span className="text-slate-200">·</span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5
                           bg-slate-900 hover:bg-slate-700 text-white
                           text-xs font-semibold rounded-lg
                           transition-colors duration-150"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                New Staff
              </button>

              <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
                <div
                  className="w-7 h-7 bg-blue-50 rounded-full flex items-center
                                justify-center"
                >
                  <span className="text-blue-600 text-xs font-bold">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <span className="text-xs font-medium text-slate-700">
                  {user?.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-slate-400 hover:text-red-500
                             transition-colors ml-1"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>

          {/* Tabs row */}
          <div className="flex items-center gap-6">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <button
                  key={tab.href}
                  onClick={() => router.push(tab.href)}
                  className={`pb-3 text-sm font-medium border-b-2 transition-colors
                              duration-150
                              ${
                                isActive
                                  ? "border-slate-900 text-slate-900"
                                  : "border-transparent text-slate-400 hover:text-slate-600"
                              }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <CreateStaffModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
