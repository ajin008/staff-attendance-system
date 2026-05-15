import AppError from "../utils/AppError";
import { Types } from "mongoose";

import {
  createAttendance,
  findAttendanceByDate,
  findAttendanceByUserAndDate,
  findTodayAllAttendance,
  getAttendanceHistoryRepo,
  updateAttendance,
} from "../Repository/attendance.repository";

import Attendance from "../models/Attendance.js";
import User from "../models/User.js";
import { todayStart, endOfDay } from "../utils/date.js";

export const checkInService = async (userId: string) => {
  const today = todayStart();

  const existingAttendance = await findAttendanceByUserAndDate(userId, today);

  if (existingAttendance?.checkIn) {
    throw new AppError("Already checked in today", 400);
  }

  if (existingAttendance) {
    return updateAttendance(existingAttendance._id.toString(), {
      checkIn: new Date(),
    });
  }
  return createAttendance({
    userId: new Types.ObjectId(userId),
    date: today,
    checkIn: new Date(),
    status: "incomplete",
  });
};

export const checkOutService = async (userId: string) => {
  const today = todayStart();

  const attendance = await findAttendanceByUserAndDate(userId, today);

  if (!attendance) {
    throw new AppError("Please check in first", 400);
  }

  if (!attendance.checkIn) {
    throw new AppError("Please check in first", 400);
  }

  if (attendance.checkOut) {
    throw new AppError("Already checked out today", 400);
  }

  const checkOutTime = new Date();

  const workMinutes = Math.floor(
    (checkOutTime.getTime() - attendance.checkIn.getTime()) / 1000 / 60
  );

  return updateAttendance(attendance._id.toString(), {
    checkOut: checkOutTime,
    workMinutes,
    status: "present",
  });
};

export const getTodayAttendanceService = async (userId: string) => {
  const today = todayStart();

  return findAttendanceByUserAndDate(userId, today);
};

export const getAttendanceHistoryService = async (userId: string) => {
  return getAttendanceHistoryRepo(userId);
};

export const getTodaySummaryService = async (date: string) => {
  const totalStaff = await User.countDocuments({ role: "staff" });
  const records = await findAttendanceByDate(date);
  const present = records.filter((r) => r.status === "present").length;
  const incomplete = records.filter((r) => r.status === "incomplete").length;
  const absent = totalStaff - records.length;
  return { total: totalStaff, present, incomplete, absent };
};

export const getTodayAllAttendanceService = async (date: string) => {
  console.log("date received in service", date);
  return findAttendanceByDate(date);
};
