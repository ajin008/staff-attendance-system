"use client";

import { useAuth } from "@/src/context/AuthContext";
import { logoutUser } from "@/src/services/auth.service";
import { useRouter } from "next/navigation";

export default function StaffNavbar() {
  const { user, logout } = useAuth();

  const router = useRouter();

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

  return (
    <nav className="border-b border-slate-100 bg-white sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-8">
        {/* Top Row */}
        <div className="h-14 flex items-center justify-between">
          {/* Left */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-900">
              Staff Portal
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
            <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
              <div
                className="w-7 h-7 bg-emerald-50 rounded-full
                           flex items-center justify-center"
              >
                <span className="text-emerald-600 text-xs font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>

              <div className="flex flex-col leading-tight">
                <span className="text-xs font-medium text-slate-700">
                  {user?.name}
                </span>

                <span className="text-[11px] text-slate-400">
                  {user?.staffId}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-xs text-slate-400 hover:text-red-500
                           transition-colors ml-2"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Label */}
        <div className="pb-3">
          <span className="text-sm font-medium border-b-2 border-slate-900 text-slate-900 pb-3">
            Dashboard
          </span>
        </div>
      </div>
    </nav>
  );
}
