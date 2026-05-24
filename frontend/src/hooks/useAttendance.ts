// src/hooks/useAttendance.ts
"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { checkIn, checkOut } from "../services/attendance.service";
import { getErrorMessage } from "../utils/axios";
import { useGeolocation } from "./useGeolocation";

interface AttendanceState {
  isCheckedIn: boolean;
  isCheckedOut: boolean;
  checkInTime?: string;
  checkOutTime?: string;
  isLoading: boolean;
  isLocating: boolean;
}

export const useAttendance = () => {
  const [state, setState] = useState<AttendanceState>({
    isCheckedIn: false,
    isCheckedOut: false,
    checkInTime: undefined,
    checkOutTime: undefined,
    isLoading: false,
    isLocating: false,
  });

  const { getCurrentPosition } = useGeolocation();

  // Handle check-in with GPS
  const handleCheckIn = useCallback(async () => {
    setState((prev) => ({ ...prev, isLocating: true }));

    try {
      // Get current location
      const { latitude, longitude } = await getCurrentPosition();

      setState((prev) => ({ ...prev, isLoading: true }));

      // Send location to backend
      const response = await checkIn(latitude, longitude);

      setState({
        isCheckedIn: true,
        isCheckedOut: false,
        checkInTime: response.attendance.checkIn,
        checkOutTime: undefined,
        isLoading: false,
        isLocating: false,
      });

      toast.success("✅ Checked in successfully!");
      return response;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setState((prev) => ({ ...prev, isLoading: false, isLocating: false }));
      throw error;
    }
  }, [getCurrentPosition]);

  // Handle check-out with GPS
  const handleCheckOut = useCallback(async () => {
    setState((prev) => ({ ...prev, isLocating: true }));

    try {
      // Get current location
      const { latitude, longitude } = await getCurrentPosition();

      setState((prev) => ({ ...prev, isLoading: true }));

      // Send location to backend
      const response = await checkOut(latitude, longitude);

      setState((prev) => ({
        ...prev,
        isCheckedOut: true,
        checkOutTime: response.attendance.checkOut,
        isLoading: false,
        isLocating: false,
      }));

      toast.success("✅ Checked out successfully!");
      return response;
    } catch (error) {
      toast.error(getErrorMessage(error));
      setState((prev) => ({ ...prev, isLoading: false, isLocating: false }));
      throw error;
    }
  }, [getCurrentPosition]);

  return {
    isCheckedIn: state.isCheckedIn,
    isCheckedOut: state.isCheckedOut,
    checkInTime: state.checkInTime,
    checkOutTime: state.checkOutTime,
    isLoading: state.isLoading,
    isLocating: state.isLocating,
    checkIn: handleCheckIn,
    checkOut: handleCheckOut,
  };
};
