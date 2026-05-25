/* eslint-disable react-hooks/set-state-in-effect */
// src/hooks/useAttendance.ts
"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  checkIn,
  checkOut,
  getTodayAttendance,
  Attendance,
} from "../services/attendance.service";
import { getErrorMessage } from "../utils/axios";
import { useGeolocation } from "./useGeolocation";

interface AttendanceState {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  currentAttendance: Attendance | null;
  isLoading: boolean;
  isLocating: boolean;
  showCheckOutModal: boolean;
  isInitialLoading: boolean;
}

export const useAttendance = () => {
  const [state, setState] = useState<AttendanceState>({
    isCheckedIn: false,
    isCheckedOut: false,
    currentAttendance: null,
    isLoading: false,
    isLocating: false,
    showCheckOutModal: false,
    isInitialLoading: true,
  });

  const { getCurrentPosition } = useGeolocation();

  // Fetch today's attendance status on page load
  const fetchTodayStatus = useCallback(async () => {
    try {
      const response = await getTodayAttendance();

      setState((prev) => ({
        ...prev,
        isCheckedIn: response.checkedIn,
        isCheckedOut: response.checkedOut,
        currentAttendance: response.attendance,
        isInitialLoading: false,
      }));

      // Show toast message if already checked in
      if (response.checkedIn && !response.checkedOut) {
        toast.info("You have an active shift from earlier");
      } else if (response.checkedOut) {
        toast.info("You've already completed today's shift");
      }
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
      setState((prev) => ({ ...prev, isInitialLoading: false }));
    }
  }, []);

  // Handle check-in with GPS
  const handleCheckIn = useCallback(async () => {
    setState((prev) => ({ ...prev, isLocating: true }));

    try {
      const { latitude, longitude } = await getCurrentPosition();
      setState((prev) => ({ ...prev, isLoading: true }));

      const response = await checkIn(latitude, longitude);

      setState({
        isCheckedIn: true,
        isCheckedOut: false,
        currentAttendance: response.attendance,
        isLoading: false,
        isLocating: false,
        showCheckOutModal: false,
        isInitialLoading: false,
      });

      const checkInTime = response.attendance.checkInTime
        ? new Date(response.attendance.checkInTime).toLocaleTimeString(
            "en-US",
            {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }
          )
        : "";
      toast.success(`Checked in at ${checkInTime}`);
      return response;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setState((prev) => ({ ...prev, isLoading: false, isLocating: false }));
    }
  }, [getCurrentPosition]);

  // Open check-out modal
  const openCheckOutModal = useCallback(() => {
    setState((prev) => ({ ...prev, showCheckOutModal: true }));
  }, []);

  // Close check-out modal
  const closeCheckOutModal = useCallback(() => {
    setState((prev) => ({ ...prev, showCheckOutModal: false }));
  }, []);

  // Handle check-out with GPS
  const handleCheckOut = useCallback(
    async (latitude: number, longitude: number) => {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const response = await checkOut(latitude, longitude);

        setState((prev) => ({
          ...prev,
          isCheckedOut: true,
          currentAttendance: response.attendance,
          isLoading: false,
          showCheckOutModal: false,
        }));

        const checkOutTime = response.attendance.checkOutTime
          ? new Date(response.attendance.checkOutTime).toLocaleTimeString(
              "en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              }
            )
          : "";
        toast.success(`Checked out at ${checkOutTime}`);
        return response;
      } catch (error) {
        toast.error(getErrorMessage(error));
        setState((prev) => ({ ...prev, isLoading: false }));
        throw error;
      }
    },
    []
  );

  // Fetch today's status on mount
  useEffect(() => {
    fetchTodayStatus();
  }, [fetchTodayStatus]);

  return {
    isCheckedIn: state.isCheckedIn,
    isCheckedOut: state.isCheckedOut,
    currentAttendance: state.currentAttendance,
    isLoading: state.isLoading,
    isLocating: state.isLocating,
    isInitialLoading: state.isInitialLoading,
    showCheckOutModal: state.showCheckOutModal,
    checkIn: handleCheckIn,
    openCheckOutModal,
    closeCheckOutModal,
    checkOut: handleCheckOut,
    refreshStatus: fetchTodayStatus,
  };
};
