import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import { AttendanceRecord, TodaySummary, Mood } from "../types";

export const checkIn = async (): Promise<AttendanceRecord> => {
  const res = await api.post<AttendanceRecord>(ENDPOINT.CHECK_IN);
  return res.data;
};

export const checkOut = async (mood: Mood): Promise<AttendanceRecord> => {
  const res = await api.post<AttendanceRecord>(ENDPOINT.CHECK_OUT, { mood });
  console.log(" checkout : mood ", mood);
  return res.data;
};

export const getMyAttendance = async (): Promise<AttendanceRecord[]> => {
  const res = await api.get<AttendanceRecord[]>(ENDPOINT.GET_MY_ATTENDANCE);
  return res.data;
};

export const getTodayAttendance =
  async (): Promise<AttendanceRecord | null> => {
    const res = await api.get<{ attendance: AttendanceRecord | null }>(
      ENDPOINT.GET_TODAY_ATTENDANCE
    );
    return res.data.attendance;
  };

export const getTodaySummary = async (date: string): Promise<TodaySummary> => {
  console.log("date passed to backend", date);
  if (!date) throw new Error("Date is required");
  const res = await api.get<TodaySummary>(
    `${ENDPOINT.GET_TODAY_SUMMARY}?date=${date}`
  );
  return res.data;
};

export const getTodayAllAttendance = async (
  date: string
): Promise<AttendanceRecord[]> => {
  console.log("date passed to backend", date);
  if (!date) throw new Error("Date is required");
  const res = await api.get<AttendanceRecord[]>(
    `${ENDPOINT.GET_TODAY_ALL_ATTENDANCE}?date=${date}`
  );
  return res.data;
};
