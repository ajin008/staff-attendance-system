// components/staff/StaffNavbar.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";
import {
  Home,
  Clock,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";
import { toast } from "sonner";
import NotificationBell from "./NotificationBell";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_REGISTRY: NavItem[] = [
  { name: "Dashboard", href: "/staff", icon: Home },
  { name: "Attendance", href: "/staff/attendance", icon: Clock },
  { name: "Leave", href: "/staff/leave", icon: Calendar },
  { name: "My Profile", href: "/staff/profile", icon: User },
];

export const StaffNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Signed out successfully");
    router.push("/login");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0F0F11] text-white border-b border-neutral-900 antialiased select-none">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Section 01: Corporate Branding Node */}
          <div className="flex items-center gap-5">
            <Link
              href="/staff"
              className="flex items-center gap-2.5 focus:outline-none"
            >
              <div className="p-1.5 border border-neutral-800 bg-neutral-900 text-white rounded">
                <LayoutGrid className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {user?.organizationId || "Pulse CRM"}
                </span>
                <span className="text-[10px] text-neutral-500 font-mono tracking-widest uppercase">
                  Workspace
                </span>
              </div>
            </Link>

            <div className="hidden sm:block h-4 w-px bg-neutral-800" />

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono">
              <span className="text-neutral-500 uppercase tracking-wider">
                ID:
              </span>
              <span className="font-bold px-2 py-0.5 rounded border border-neutral-800 bg-neutral-900/60 text-neutral-300">
                {user?.staffId || "N/A"}
              </span>
            </div>
          </div>

          {/* Section 02: High-Density Text Navigation Menu */}
          <div className="hidden md:flex items-center h-full gap-1">
            {NAV_REGISTRY.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/staff" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`h-16 px-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-all focus:outline-none ${
                    isActive
                      ? "border-emerald-500 text-white bg-neutral-900/40"
                      : "border-transparent text-neutral-400 hover:text-white hover:bg-neutral-900/20"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Section 03: Direct Exit Button Gateway & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <NotificationBell />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-neutral-800 bg-neutral-900/40 hover:bg-rose-500/10 text-neutral-400 hover:text-rose-400 rounded text-xs font-mono font-bold uppercase tracking-wider transition-all focus:outline-none"
              title="Terminate Session"
            >
              <LogOut className="h-3.5 w-3.5 stroke-[2.5]" />
              <span>Exit</span>
            </button>

            {/* Mobile Responsive Menu Switch */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 border border-neutral-800 hover:bg-neutral-900 text-neutral-400 rounded transition-colors focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Context Overlay Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-[#0F0F11]/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="absolute top-16 left-0 right-0 border-b border-neutral-900 p-4 bg-[#0F0F11] flex flex-col gap-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {NAV_REGISTRY.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/staff" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 border rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-neutral-900 border-neutral-800 text-white"
                      : "border-transparent text-neutral-400 hover:bg-neutral-900/40"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0 stroke-[2.5]" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            <div className="h-px my-1.5 bg-neutral-900" />

            {/* Mobile Sign-Out Row */}
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2.5 border border-transparent rounded text-xs font-bold uppercase tracking-wider text-rose-400 hover:bg-rose-500/10 text-left transition-colors focus:outline-none"
            >
              <LogOut className="h-4 w-4 shrink-0 stroke-[2.5]" />
              <span>Exit Workspace</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Layout Structural Blueprint Spacing Guard */}
      <div className="h-16" />
    </>
  );
};
