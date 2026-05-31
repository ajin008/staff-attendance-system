import { Router } from "express";
import { protect } from "../middleware/protect.js";
import {
  checkInStaffController,
  checkOutStaffController,
  getStaffProfileController,
  getTodayAttendanceController,
} from "../controllers/staff.controller.js";
import {
  createLeaveRequestController,
  getMyLeavesController,
} from "../controllers/leave.controller.js";
import { getMyAttendanceController } from "../controllers/attendance.controller.js";
import { getMyFloorAllocationController } from "../controllers/floor.controller.js";
import {
  getStaffNotificationsController,
  getUnreadNotificationCountController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/notification.controller.js";
import {
  readRateLimit,
  writeRateLimit,
  notificationRateLimit,
} from "../utils/rateLimiting.js";

const router = Router();

router.post("/check-in", protect, writeRateLimit, checkInStaffController);
router.post("/check-out", protect, writeRateLimit, checkOutStaffController);
router.get(
  "/attendance/today",
  protect,
  readRateLimit,
  getTodayAttendanceController
);
router.post(
  "/leaves/create",
  protect,
  writeRateLimit,
  createLeaveRequestController
);
router.get("/leaves/my-leaves", protect, readRateLimit, getMyLeavesController);
router.get("/profile", protect, readRateLimit, getStaffProfileController);
router.get(
  "/attendance/history",
  protect,
  readRateLimit,
  getMyAttendanceController
);
router.get(
  "/my-allocation",
  protect,
  readRateLimit,
  getMyFloorAllocationController
);

router.get(
  "/notifications",
  protect,
  notificationRateLimit,
  getStaffNotificationsController
);
router.patch(
  "/notifications/:notificationId/read",
  protect,
  notificationRateLimit,
  markNotificationReadController
);
router.patch(
  "/notifications/read-all",
  protect,
  notificationRateLimit,
  markAllNotificationsReadController
);
router.get(
  "/notifications/unread-count",
  protect,
  notificationRateLimit,
  getUnreadNotificationCountController
);

export default router;
