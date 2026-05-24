// src/services/attendance.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface LocationPayload {
  latitude: number;
  longitude: number;
}

export interface AttendanceResponse {
  message: string;
  attendance: {
    id: number;
    staffId: number;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY";
    overtime?: number;
    latitude?: number;
    longitude?: number;
  };
}

export interface TodayAttendanceResponse {
  id: number;
  staffId: number;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  overtime?: number;
  latitude?: number;
  longitude?: number;
}

export const checkIn = async (
  latitude: number,
  longitude: number
): Promise<AttendanceResponse> => {
  const response = await api.post<AttendanceResponse>(ENDPOINT.CHECK_IN, {
    latitude,
    longitude,
  });
  return response.data;
};

export const checkOut = async (
  latitude: number,
  longitude: number
): Promise<AttendanceResponse> => {
  const response = await api.post<AttendanceResponse>(ENDPOINT.CHECK_OUT, {
    latitude,
    longitude,
  });
  return response.data;
};

export const getTodayAttendance =
  async (): Promise<TodayAttendanceResponse | null> => {
    try {
      const response = await api.get<TodayAttendanceResponse>(
        ENDPOINT.GET_TODAY_ATTENDANCE
      );
      return response.data;
    } catch (error) {
      // Return null if no attendance record for today (404 or no data)
      return null;
    }
  };
