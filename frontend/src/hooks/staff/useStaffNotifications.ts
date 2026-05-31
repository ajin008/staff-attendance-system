/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/staff/useStaffNotifications.ts
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

interface UseStaffNotificationsProps {
  autoFetch?: boolean;
  onNotificationRead?: (notification: StaffNotification) => void;
}

export function useStaffNotifications({
  autoFetch = true,
  onNotificationRead,
}: UseStaffNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  // Track if this is the first load
  const isFirstLoad = useRef(true);
  // Track last known unread count
  const lastUnreadCount = useRef(0);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getStaffNotifications();
      const newNotifications = response.data || [];
      const newUnreadCount = response.unreadCount || 0;

      // Only show toast for NEW notifications (not on first load)
      if (!isFirstLoad.current && newUnreadCount > lastUnreadCount.current) {
        const newCount = newUnreadCount - lastUnreadCount.current;
        toast.info(
          `🔔 ${newCount} new notification${newCount > 1 ? "s" : ""}`,
          {
            duration: 4000,
          }
        );
      }

      setNotifications(newNotifications);
      setUnreadCount(newUnreadCount);
      lastUnreadCount.current = newUnreadCount;
      isFirstLoad.current = false;
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoading(false);
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
        lastUnreadCount.current = Math.max(0, lastUnreadCount.current - 1);

        const markedNotification = notifications.find(
          (n) => n.id === notificationId
        );
        if (markedNotification && onNotificationRead) {
          onNotificationRead(markedNotification);
        }
      } catch (error) {
        console.error("Error marking notification as read:", error);
      } finally {
        setMarkingId(null);
      }
    },
    [notifications, onNotificationRead]
  );

  const markAllAsRead = useCallback(async () => {
    if (unreadCount === 0) return;

    try {
      await markAllStaffNotificationsAsRead();

      // Update local state
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
      lastUnreadCount.current = 0;

      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [unreadCount]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    isFirstLoad.current = true; // Reset first load flag
    await fetchNotifications();
    setIsRefreshing(false);
  }, [fetchNotifications]);

  // Only fetch on mount, no automatic polling
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  // REMOVED: The automatic polling interval that was causing the glitch

  return {
    notifications,
    isLoading,
    unreadCount,
    isRefreshing,
    markingId,
    markAsRead,
    markAllAsRead,
    refresh,
  };
}
