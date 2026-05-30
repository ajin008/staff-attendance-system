/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useStaffNotifications.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import {
  getStaffNotifications,
  markStaffNotificationAsRead,
  markAllStaffNotificationsAsRead,
  getUnreadNotificationCount,
  type StaffNotification,
} from "@/src/services/notification.service";
import { getErrorMessage } from "@/src/utils/axios";

interface UseStaffNotificationsProps {
  autoFetch?: boolean;
  onNotificationRead?: (notification: StaffNotification) => void;
  showErrorToasts?: boolean;
}

export function useStaffNotifications({
  autoFetch = true,
  onNotificationRead,
  showErrorToasts = false,
}: UseStaffNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  // Track if we've shown a new notification toast
  const previousUnreadCount = useRef(0);
  const hasShownToast = useRef(false);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStaffNotifications();
      const newNotifications = response.data || [];
      const newUnreadCount = response.unreadCount || 0;

      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);

      // Show toast for new unread notifications (only if count increased)
      if (
        autoFetch &&
        previousUnreadCount.current > 0 &&
        newUnreadCount > previousUnreadCount.current
      ) {
        const newCount = newUnreadCount - previousUnreadCount.current;
        toast.info(
          `You have ${newCount} new notification${newCount > 1 ? "s" : ""}`,
          {
            duration: 4000,
          }
        );
      }

      previousUnreadCount.current = newUnreadCount;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      // Only show error toast if explicitly enabled
      if (showErrorToasts) {
        toast.error(getErrorMessage(error));
      }
    } finally {
      setIsLoading(false);
    }
  }, [autoFetch, showErrorToasts]);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const response = await getUnreadNotificationCount();
      const newUnreadCount = response.unreadCount;

      // Only show toast if unread count increased and we're not in the initial load
      if (
        previousUnreadCount.current > 0 &&
        newUnreadCount > previousUnreadCount.current
      ) {
        const newCount = newUnreadCount - previousUnreadCount.current;
        toast.info(
          `You have ${newCount} new notification${newCount > 1 ? "s" : ""}`,
          {
            duration: 4000,
          }
        );
      }

      setUnreadCount(newUnreadCount);
      previousUnreadCount.current = newUnreadCount;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      // Silent fail - no toast for this background operation
    }
  }, []);

  const markAsRead = useCallback(
    async (notificationId: number) => {
      setMarkingId(notificationId);
      try {
        await markStaffNotificationAsRead(notificationId);

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        const markedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (markedNotification && onNotificationRead) {
          onNotificationRead(markedNotification);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
        // Silent fail - no toast for individual read operations
      } finally {
        setMarkingId(null);
      }
    },
    [notifications, onNotificationRead]
  );

  const markAllAsRead = useCallback(async () => {
    try {
      await markAllStaffNotificationsAsRead();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      // Only show success toast when there were unread notifications
      if (previousUnreadCount.current > 0) {
        toast.success("All notifications marked as read");
      }

      previousUnreadCount.current = 0;
    } catch (error) {
      console.error("Error marking all as read:", error);
      // Silent fail - no toast for errors
    }
  }, []);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchNotifications();
    setIsRefreshing(false);
  }, [fetchNotifications]);

  // Auto-fetch notifications on mount
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!autoFetch) return;

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [autoFetch, fetchUnreadCount]);

  return {
    notifications,
    isLoading,
    unreadCount,
    isRefreshing,
    markingId,
    markAsRead,
    markAllAsRead,
    refresh,
    fetchUnreadCount,
  };
}
