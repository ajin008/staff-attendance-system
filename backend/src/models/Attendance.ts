import mongoose, { Document } from "mongoose";

export interface IAttendance extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  checkIn: Date | null;
  checkOut: Date | null;
  workMinutes: number;
  status: "present" | "absent" | "leave" | "incomplete";
  mood: "tired" | "okay" | "good" | "happy" | "excited" | null;
}

const attendanceSchema = new mongoose.Schema<IAttendance>(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    checkIn: { type: Date, default: null },
    checkOut: { type: Date, default: null },
    workMinutes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["present", "incomplete", "absent"],
      default: "absent",
    },
    mood: {
      type: String,
      enum: ["tired", "okay", "good", "happy", "excited"],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });
// for admin
attendanceSchema.index({ date: 1 });
// for staff
attendanceSchema.index({ userId: 1 });

export default mongoose.model<IAttendance>("Attendance", attendanceSchema);
