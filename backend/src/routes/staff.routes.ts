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
import { getMyFloorAllocationController } from "../controllers/floor.controller";
import {
  getStaffNotificationsController,
  getUnreadNotificationCountController,
  markAllNotificationsReadController,
  markNotificationReadController,
} from "../controllers/notification.controller";
import {
  readRateLimit,
  writeRateLimit,
  notificationRateLimit,
} from "../utils/rateLimiting";

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
