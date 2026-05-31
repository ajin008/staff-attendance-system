// app/staff/notifications/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Clock, CheckCircle, ArrowLeft } from "lucide-react";
import { StaffNavbar } from "@/components/staff/StaffNavbar";
import { useStaffNotifications } from "@/src/hooks/staff/useStaffNotifications";
import { formatDistanceToNow } from "date-fns";

export default function StaffNotificationsPage() {
  const router = useRouter();
  const {
    notifications,
    isLoading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useStaffNotifications();

  useEffect(() => {
    refresh();
  }, []);

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <StaffNavbar />

      <div className="w-full max-w-[1600px] mx-auto px-6 py-8 flex-1">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-mono font-medium text-slate-400 uppercase tracking-wider mb-2">
            <Bell className="h-3.5 w-3.5" />
            <span>Communications</span>
            <span className="text-neutral-700">/</span>
            <span className="text-slate-600">Notifications</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Notifications
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                View and manage all your notifications
              </p>
            </div>

            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  Mark all as read
                </button>
              )}

              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Total Notifications
            </p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {notifications.length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Unread
            </p>
            <p className="text-2xl font-bold text-rose-500 mt-1">
              {unreadCount}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              Read
            </p>
            <p className="text-2xl font-bold text-emerald-500 mt-1">
              {notifications.filter((n) => n.isRead).length}
            </p>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-10 h-10 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs text-slate-400">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
              <Bell className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-900 font-semibold text-sm">
                No notifications
              </p>
              <p className="text-xs text-slate-400 mt-1">
                You&lsquo;re all caught up!
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() =>
                  !notification.isRead && markAsRead(notification.id)
                }
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  notification.isRead
                    ? "bg-white border-slate-200"
                    : "bg-slate-50/80 border-slate-300 shadow-sm"
                } hover:border-slate-400`}
              >
                <div className="shrink-0">
                  {notification.isRead ? (
                    <CheckCircle className="h-5 w-5 text-slate-400" />
                  ) : (
                    <Bell className="h-5 w-5 text-rose-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                    <h3
                      className={`text-sm font-semibold ${
                        notification.isRead
                          ? "text-slate-600"
                          : "text-slate-900"
                      }`}
                    >
                      {notification.title}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {notification.message}
                  </p>
                </div>
                {!notification.isRead && (
                  <div className="shrink-0">
                    <div className="w-2 h-2 rounded-full bg-rose-500" />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
