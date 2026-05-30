/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/notification/useAdminNotifications.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  getAdminNotifications,
  getNotificationMonths,
  type AdminNotification,
  type GetNotificationsParams,
} from "@/src/services/notification.service";
import { getErrorMessage } from "@/src/utils/axios";

interface UseAdminNotificationsProps {
  autoFetch?: boolean;
  defaultMonth?: number;
  defaultYear?: number;
}

export function useAdminNotifications({
  autoFetch = true,
  defaultMonth = new Date().getMonth() + 1,
  defaultYear = new Date().getFullYear(),
}: UseAdminNotificationsProps = {}) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(defaultMonth);
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [filterType, setFilterType] = useState<"ALL" | "PERSONAL" | "all">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [availableMonths, setAvailableMonths] = useState<
    Array<{ month: number; year: number; count: number }>
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Generate month options
  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = [2024, 2025, 2026];

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: GetNotificationsParams = {
        month: selectedMonth,
        year: selectedYear,
        type: filterType !== "all" ? filterType : undefined,
        search: searchQuery || undefined,
      };

      const response = await getAdminNotifications(params);
      setNotifications(response.data || []);
      setTotalCount(response.total || 0);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [selectedMonth, selectedYear, filterType, searchQuery]);

  const fetchAvailableMonths = useCallback(async () => {
    try {
      const response = await getNotificationMonths();
      setAvailableMonths(response.months || []);
    } catch (error) {
      console.error("Error fetching available months:", error);
    }
  }, []);

  // Handle month change
  const handleMonthChange = (month: number) => {
    setSelectedMonth(month);
  };

  // Handle year change
  const handleYearChange = (year: number) => {
    setSelectedYear(year);
  };

  // Auto-fetch on mount and when filters change
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [autoFetch, fetchNotifications]);

  // Fetch available months on mount
  useEffect(() => {
    fetchAvailableMonths();
  }, [fetchAvailableMonths]);

  return {
    notifications,
    isLoading,
    isRefreshing,
    selectedMonth,
    selectedYear,
    filterType,
    searchQuery,
    totalCount,
    availableMonths,
    months,
    years,
    setFilterType,
    setSearchQuery,
    handleMonthChange,
    handleYearChange,
    refresh: fetchNotifications,
  };
}
