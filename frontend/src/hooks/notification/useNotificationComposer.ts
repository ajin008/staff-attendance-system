/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useNotificationComposer.ts
"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { toast } from "sonner";
import {
  sendAllStaffNotification,
  sendPersonalNotification,
  searchStaffMembers,
} from "@/src/services/notification.service";
import type { Staff } from "@/src/types";
import { getErrorMessage } from "@/src/utils/axios";

interface UseNotificationComposerProps {
  onSuccess?: () => void;
}

export function useNotificationComposer({
  onSuccess,
}: UseNotificationComposerProps = {}) {
  const [sendType, setSendType] = useState<"ALL" | "PERSONAL">("ALL");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [searchStaff, setSearchStaff] = useState("");
  const [debouncedSearchStaff] = useDebounce(searchStaff, 500);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [showStaffDropdown, setShowStaffDropdown] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingStaff, setIsLoadingStaff] = useState(false);

  // Search staff members
  const handleSearchStaff = useCallback(async () => {
    if (!debouncedSearchStaff.trim()) {
      setStaffList([]);
      return;
    }

    setIsLoadingStaff(true);
    try {
      const response = await searchStaffMembers(debouncedSearchStaff);
      setStaffList(response.data || []);
      setShowStaffDropdown(true);
    } catch (error) {
      console.error("Error searching staff:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoadingStaff(false);
    }
  }, [debouncedSearchStaff]);

  useEffect(() => {
    handleSearchStaff();
  }, [handleSearchStaff]);

  const resetForm = useCallback(() => {
    setTitle("");
    setMessage("");
    setSelectedStaff(null);
    setSearchStaff("");
    setStaffList([]);
    setShowStaffDropdown(false);
  }, []);

  const clearForm = useCallback(() => {
    resetForm();
    setSendType("ALL");
  }, [resetForm]);

  const sendNotification = useCallback(async () => {
    // Validation
    if (!title.trim()) {
      toast.error("Please enter a notification title");
      return false;
    }

    if (!message.trim()) {
      toast.error("Please enter a notification message");
      return false;
    }

    if (sendType === "PERSONAL" && !selectedStaff) {
      toast.error("Please select a staff member");
      return false;
    }

    setIsSending(true);
    try {
      let response;
      if (sendType === "ALL") {
        response = await sendAllStaffNotification({
          title: title.trim(),
          message: message.trim(),
          type: "ALL",
        });
        toast.success("Broadcast notification sent to all staff");
      } else {
        response = await sendPersonalNotification({
          title: title.trim(),
          message: message.trim(),
          type: "PERSONAL",
          targetUserId: selectedStaff!.id,
        });
        toast.success(`Personal notification sent to ${selectedStaff?.name}`);
      }

      resetForm();
      onSuccess?.();
      return true;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return false;
    } finally {
      setIsSending(false);
    }
  }, [title, message, sendType, selectedStaff, resetForm, onSuccess]);

  const selectStaff = useCallback((staff: Staff) => {
    setSelectedStaff(staff);
    setSearchStaff(staff.name);
    setShowStaffDropdown(false);
  }, []);

  const removeSelectedStaff = useCallback(() => {
    setSelectedStaff(null);
    setSearchStaff("");
  }, []);

  const toggleSendType = useCallback((type: "ALL" | "PERSONAL") => {
    setSendType(type);
    if (type === "ALL") {
      setSelectedStaff(null);
      setSearchStaff("");
    }
  }, []);

  return {
    // State
    sendType,
    title,
    message,
    selectedStaff,
    searchStaff,
    staffList,
    showStaffDropdown,
    isSending,
    isLoadingStaff,

    // Setters
    setTitle,
    setMessage,
    setSearchStaff,
    setShowStaffDropdown,

    // Actions
    clearForm,
    sendNotification,
    selectStaff,
    removeSelectedStaff,
    toggleSendType,
  };
}
