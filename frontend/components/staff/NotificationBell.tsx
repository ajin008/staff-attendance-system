// components/staff/NotificationBell.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, Clock } from "lucide-react";
import { useStaffNotifications } from "@/src/hooks/staff/useStaffNotifications";
import { formatDistanceToNow } from "date-fns";
import type { StaffNotification } from "@/src/services/notification.service";

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    isLoading,
    unreadCount,
    markingId,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useStaffNotifications();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return "";
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return "";
    }
  };

  const handleNotificationClick = (notification: StaffNotification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    // Optional: Navigate to specific notification detail page
    // router.push(`/staff/notifications/${notification.id}`);
  };

  const handleViewAll = () => {
    setIsOpen(false);
    router.push("/staff/notifications");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) refresh();
        }}
        className="relative flex items-center gap-2 px-3 py-1.5 border border-neutral-800 bg-neutral-900/40 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white transition-all focus:outline-none"
        title="Notifications"
      >
        <Bell className="h-3.5 w-3.5 stroke-[2.5]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-[#0F0F11] border border-neutral-800 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-neutral-400" />
              <span className="text-sm font-semibold text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-rose-500/20 text-rose-400 text-[10px] font-medium rounded">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-medium text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
              >
                <CheckCheck className="h-3 w-3" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-neutral-700 border-t-white rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-8 w-8 text-neutral-700 mx-auto mb-2" />
                <p className="text-xs text-neutral-500">No notifications</p>
                <p className="text-[10px] text-neutral-600 mt-1">
                  You&lsquo;re all caught up!
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3 border-b border-neutral-800/50 cursor-pointer transition-colors ${
                    !notification.isRead
                      ? "bg-neutral-900/40 hover:bg-neutral-900"
                      : "hover:bg-neutral-900/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={`text-sm font-medium ${
                            !notification.isRead
                              ? "text-white"
                              : "text-neutral-300"
                          }`}
                        >
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.createdAt && (
                        <p className="text-[10px] text-neutral-500 mt-1.5 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />
                          {getTimeAgo(notification.createdAt)}
                        </p>
                      )}
                    </div>
                    {markingId === notification.id && (
                      <div className="w-4 h-4 border-2 border-neutral-600 border-t-white rounded-full animate-spin shrink-0" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-neutral-800 bg-neutral-900/30">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-[10px] font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
