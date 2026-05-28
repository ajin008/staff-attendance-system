import { Router } from "express";
import { protect } from "../middleware/protect";
import {
  checkInStaffController,
  checkOutStaffController,
  getStaffProfileController,
  getTodayAttendanceController,
} from "../controllers/staff.controller";

import {
  createLeaveRequestController,
  getMyLeavesController,
} from "../controllers/leave.controller";
import { getMyAttendanceController } from "../controllers/attendance.controller";
const router = Router();

router.post("/check-in", protect, checkInStaffController);
router.post("/check-out", protect, checkOutStaffController);
router.get("/attendance/today", protect, getTodayAttendanceController);
router.post("/leaves/create", protect, createLeaveRequestController);
router.get("/leaves/my-leaves", protect, getMyLeavesController);
router.get("/profile", protect, getStaffProfileController);
router.get("/attendance/history", protect, getMyAttendanceController);

export default router;
