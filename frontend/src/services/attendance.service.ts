// src/services/attendance.service.ts
import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";

export interface Branch {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  allowedRadius: number;
}

export interface Attendance {
  id: number;
  checkInTime?: string;
  checkOutTime?: string;
  attendanceStatus: string;
  shiftStart: string;
  shiftEnd: string;
  lateMinutes: number;
  isLate: boolean;
  branch?: Branch;
}

export interface AttendanceResponse {
  message: string;
  attendance: Attendance;
}

export interface TodayAttendanceResponse {
  checkedIn: boolean;
  checkedOut: boolean;
  attendance: Attendance | null;
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

// this is for staff
export const getTodayAttendance =
  async (): Promise<TodayAttendanceResponse> => {
    const response = await api.get<TodayAttendanceResponse>(
      ENDPOINT.GET_TODAY_ATTENDANCE
    );
    console.log("response from getTodayAttendance:", response.data);
    return response.data;
  };

// this is for admin
export interface AbsentStaff {
  id: number;
  staffId: string;
  name: string;
  email: string;
}

// For present staff (has user object nested)
export interface PresentStaff {
  id: number;
  checkInTime: string;
  isLate: boolean;
  lateMinutes: number;
  branch: { id: number; name: string };
  user: {
    id: number;
    staffId: string;
    name: string;
    email: string;
  };
}

// For late staff (has user object nested, no branch)
export interface LateStaff {
  id: number;
  checkInTime: string;
  lateMinutes: number;
  user: {
    id: number;
    staffId: string;
    name: string;
  };
}

export interface AttendanceCategoryPresent {
  count: number;
  staff: PresentStaff[];
}

export interface AttendanceCategoryAbsent {
  count: number;
  staff: AbsentStaff[];
}

export interface AttendanceCategoryLate {
  count: number;
  staff: LateStaff[];
}

export interface TodayAttendanceData {
  present: AttendanceCategoryPresent;
  absent: AttendanceCategoryAbsent;
  late: AttendanceCategoryLate;
}

export interface TodayAttendanceDataResponse {
  message: string;
  data: TodayAttendanceData;
}

export const getTodayAttendanceData =
  async (): Promise<TodayAttendanceDataResponse> => {
    const response = await api.get<TodayAttendanceDataResponse>(
      ENDPOINT.GET_TODAY_ATTENDANCE_DATA
    );
    return response.data;
  };
