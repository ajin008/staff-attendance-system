import { Router } from "express";
import { protect } from "../middleware/protect";
import {
  checkInStaffController,
  checkOutStaffController,
  getTodayAttendanceController,
} from "../controllers/staff.controller";

import {
  createLeaveRequestController,
  getMyLeavesController,
} from "../controllers/leave.controller";
const router = Router();

router.post("/check-in", protect, checkInStaffController);
router.post("/check-out", protect, checkOutStaffController);
router.get("/attendance/today", protect, getTodayAttendanceController);
router.post("/leaves/create", protect, createLeaveRequestController);
router.get("/leaves/my-leaves", protect, getMyLeavesController);

export default router;
