import { Router } from "express";
import { adminOnly } from "../middleware/protect";

import {
  checkIn,
  checkOut,
  getAttendanceHeatmap,
  getAttendanceHistory,
  getTodayAllAttendance,
  getTodayAttendance,
  getTodaySummary,
} from "../controllers/attendance.controller";

import { protect } from "../middleware/protect";

const router = Router();

router.post("/check-in", protect, checkIn);

router.post("/check-out", protect, checkOut);

router.get("/today", protect, getTodayAttendance);

router.get("/today/summary", protect, adminOnly, getTodaySummary);
router.get("/today/all", protect, adminOnly, getTodayAllAttendance);
router.get("/heatmap", protect, getAttendanceHeatmap);

router.get("/history", protect, getAttendanceHistory);

export default router;
