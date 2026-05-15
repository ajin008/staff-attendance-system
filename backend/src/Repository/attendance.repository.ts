import Attendance, { IAttendance } from "../models/Attendance";
import { startOfDay, endOfDay } from "../utils/date.js";
import AppError from "../utils/AppError.js";

export const findAttendanceByUserAndDate = async (
  userId: string,
  date: Date
): Promise<IAttendance | null> => {
  return Attendance.findOne({
    userId,
    date,
  });
};

export const createAttendance = async (
  data: Partial<IAttendance>
): Promise<IAttendance> => {
  return Attendance.create(data);
};

export const updateAttendance = async (
  id: string,
  data: Partial<IAttendance>
): Promise<IAttendance | null> => {
  return Attendance.findByIdAndUpdate(id, data, {
    new: true,
  });
};

export const getAttendanceHistoryRepo = async (
  userId: string
): Promise<IAttendance[]> => {
  return Attendance.find({ userId }).sort({ date: -1 });
};

export const findTodayAllAttendance = async (): Promise<IAttendance[]> => {
  return Attendance.find({
    date: {
      $gte: startOfDay(),
      $lte: endOfDay(),
    },
  })
    .populate("userId", "name staffId email")
    .sort({ checkIn: -1 });
};

export const findAttendanceByDate = async (dateStr: string) => {
  console.log("date str in repo", dateStr);
  // parse YYYY-MM-DD manually — reliable across all environments
  const [year, month, day] = dateStr.split("-").map(Number);

  if (!year || !month || !day) {
    throw new AppError("Invalid date format", 400);
  }

  const start = new Date(year, month - 1, day, 0, 0, 0, 0);
  const end = new Date(year, month - 1, day, 23, 59, 59, 999);

  return Attendance.aggregate([
    {
      $match: {
        date: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
        pipeline: [{ $project: { name: 1, staffId: 1, email: 1 } }],
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 1,
        userId: "$user._id",
        name: "$user.name",
        staffId: "$user.staffId",
        email: "$user.email",
        date: 1,
        checkIn: 1,
        checkOut: 1,
        workMinutes: 1,
        status: 1,
      },
    },
  ]);
};
