import { Router } from "express";
import { protect } from "../middleware/protect";
import {
  checkInStaffController,
  checkOutStaffController,
  getTodayAttendanceController,
} from "../controllers/staff.controller";
const router = Router();

router.post("/check-in", protect, checkInStaffController);
router.post("/check-out", protect, checkOutStaffController);
router.get("/attendance/today", protect, getTodayAttendanceController);

export default router;
