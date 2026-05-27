// components/staff/StaffNavbar.tsx
"use client";

import { useState, useEffect } from "react";
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
  ChevronRight,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useLeaveRequest } from "@/src/hooks/staff/useLeaveRequest";
import LeaveRequestModal from "./LeaveRequestModal";

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/staff",
    icon: <Home className="h-4 w-4" />,
  },
  {
    name: "Attendance",
    href: "/staff/attendance",
    icon: <Clock className="h-4 w-4" />,
  },
  {
    name: "leave ",
    href: "/staff/leave",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    name: "Profile",
    href: "/staff/profile",
    icon: <User className="h-4 w-4" />,
  },
];

export const StaffNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const {
    isOpen: isLeaveModalOpen,
    isSubmitting: isLeaveSubmitting,
    openModal: openLeaveModal,
    closeModal: closeLeaveModal,
    submitLeaveRequest,
  } = useLeaveRequest();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getStaffInitials = () => {
    if (!user?.name) return "ST";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <>
      {/* Organic navbar container */}
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-500 ease-out
          ${
            scrolled
              ? "bg-white/80 backdrop-blur-lg border-b border-slate-100 shadow-sm"
              : "bg-transparent"
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo Section - Handmade feel */}
            <div className="flex items-center gap-3">
              <Link href="/staff" className="group flex items-center gap-2">
                {/* Organic squiggle logo mark */}
                <div className="relative">
                  <svg
                    className="w-7 h-7 text-emerald-500"
                    viewBox="0 0 40 40"
                    fill="none"
                  >
                    <path
                      d="M12,20 C12,15 16,12 20,12 C24,12 28,15 28,20 C28,25 24,28 20,28 C16,28 12,25 12,20 Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M20,8 L20,32 M8,20 L32,20"
                      stroke="currentColor"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                      opacity="0.4"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-medium tracking-tight text-slate-800 leading-none">
                    Pulse
                  </span>
                  <span className="text-[9px] font-mono text-slate-400 tracking-wider">
                    STAFF PORTAL
                  </span>
                </div>
              </Link>

              {/* Hand-drawn divider */}
              <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1" />
              <div className="hidden sm:flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-emerald-400" />
                <span className="text-[10px] font-mono text-slate-400">
                  {user?.staffId || "STAFF"}
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/staff" && pathname?.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`
                      relative group px-4 py-2 rounded-full text-sm font-medium
                      transition-all duration-200 ease-out
                      ${
                        isActive
                          ? "text-slate-900 bg-slate-100"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }
                    `}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.name}
                    </span>

                    {/* Active indicator dot */}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu Section */}
            <div className="flex items-center gap-3">
              {/* Leave Request Button */}
              <button
                onClick={openLeaveModal}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-all duration-200"
              >
                <FileText className="h-3.5 w-3.5" />
                <span className="text-xs">Request Leave</span>
              </button>

              {/* Staff info - organic card feel */}
              <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-50/80 border border-slate-100">
                {/* Avatar - hand-drawn style */}
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                    <span className="text-[11px] font-medium text-slate-600">
                      {getStaffInitials()}
                    </span>
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white" />
                </div>

                <div className="flex flex-col">
                  <span className="text-xs font-medium text-slate-700 leading-tight">
                    {user?.name?.split(" ")[0] || "Staff"}
                  </span>
                  <span className="text-[9px] font-mono text-slate-400">
                    {user?.role?.toUpperCase()}
                  </span>
                </div>

                {/* Hand-drawn separator */}
                <div className="w-px h-4 bg-slate-200" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors group"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="text-[11px]">Exit</span>
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Decorative bottom line - handmade touch */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200/50 to-transparent" />
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          transition-all duration-300 ease-out
          ${isMobileMenuOpen ? "visible" : "invisible"}
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-slate-900/20 backdrop-blur-sm
            transition-opacity duration-300
            ${isMobileMenuOpen ? "opacity-100" : "opacity-0"}
          `}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`
            absolute top-16 left-0 right-0 mx-4
            bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl
            border border-slate-100 overflow-hidden
            transition-all duration-300 ease-out
            ${
              isMobileMenuOpen
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4"
            }
          `}
        >
          <div className="p-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/staff" && pathname?.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl
                    transition-all duration-150
                    ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-8 h-8 rounded-full flex items-center justify-center
                      ${isActive ? "bg-white" : "bg-transparent"}
                    `}
                    >
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium">{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                </Link>
              );
            })}

            {/* Mobile Leave Request Button */}
            <button
              onClick={() => {
                openLeaveModal();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-150"
            >
              <FileText className="h-4 w-4" />
              <span className="text-sm font-medium">Request Leave</span>
            </button>

            {/* Mobile logout */}
            <div className="border-t border-slate-100 my-2" />
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 transition-all duration-150"
            >
              <div className="flex items-center gap-3">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </div>
            </button>

            {/* Staff info footer */}
            <div className="mt-3 pt-3 border-t border-slate-100 px-4 pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-slate-500">
                      {getStaffInitials()}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-700">
                      {user?.name || "Staff User"}
                    </p>
                    <p className="text-[9px] font-mono text-slate-400">
                      {user?.staffId || "STAFF"}
                    </p>
                  </div>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Request Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={closeLeaveModal}
        onSubmit={submitLeaveRequest}
        isSubmitting={isLeaveSubmitting}
      />

      {/* Spacer to prevent content from going under navbar */}
      <div className="h-16 lg:h-20" />
    </>
  );
};
