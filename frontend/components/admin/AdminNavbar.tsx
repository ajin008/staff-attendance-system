// components/admin/AdminNavbar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logoutUser } from "@/src/services/auth.service";
import { getErrorMessage } from "@/src/utils/axios";
import { useAuth } from "@/src/context/AuthContext";
import { User, LogOut } from "lucide-react";

export default function AdminNavbar() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      logout();
      toast.success("Logged out successfully");
      router.replace("/login");
    } catch (err) {
      toast.error(getErrorMessage(err));
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/60">
      <div className="flex items-center justify-between px-6 py-4 max-w-[1600px] mx-auto w-full antialiased">
        {/* Left Side: Accurate Geometric Diamond Identity and Context Tag */}
        <div
          onClick={() => router.push("/admin")}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          {/* High-Contrast Login Pattern Matching Diamond Vector */}
          <div className="relative w-7 h-7 flex items-center justify-center bg-slate-900 rounded-md border border-slate-950 shadow-sm transition-transform duration-200 group-hover:scale-102">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-white"
            >
              <path d="M2 12L12 2l10 10-10 10Z" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </div>

          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold tracking-tight text-slate-900 uppercase">
              Pulse
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase pl-1"></span>
          </div>
        </div>

        {/* Right Side: Account Navigation and Session Actions */}
        <div className="flex items-center gap-2">
          {/* Profile View Link Button */}
          <button
            onClick={() => router.push("/admin/profile")}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white rounded-md text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-slate-900 transition-all"
          >
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>Profile</span>
          </button>

          {/* Session Termination Button */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider
              transition-all focus:outline-none
              ${
                isLoggingOut
                  ? "bg-slate-50 border border-slate-200 text-slate-400 cursor-not-allowed font-mono text-[11px]"
                  : "bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700"
              }
            `}
          >
            {isLoggingOut ? (
              <>
                <svg
                  className="h-3 w-3 animate-spin text-slate-400"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Disconnecting...</span>
              </>
            ) : (
              <>
                <LogOut className="h-3.5 w-3.5" />
                <span>Exit</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
