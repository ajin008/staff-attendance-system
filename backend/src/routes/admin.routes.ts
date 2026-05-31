import { Router } from "express";
import { adminOnly, protect } from "../middleware/protect";
import {
  createDepartment,
  deleteDepartmentController,
  fetchDepartmentController,
  getDepartmentByIdController,
  toggleDepartmentStatusController,
  updateDepartmentController,
} from "../controllers/department.controller";
import { createStaff } from "../controllers/auth.controller";
import {
  getAllStaffController,
  getStatusController,
  getStaffByIdController,
  updateStaffController,
  deleteStaffController,
  getTodayAttendanceDataController,
} from "../controllers/admin.controller";
import {
  deleteBranchController,
  getAllBranchesController,
} from "../controllers/branch.controller";
import {
  getTodayAttendanceController,
  toggleStaffStatusController,
} from "../controllers/staff.controller";
import {
  createFloorController,
  deleteFloorController,
  getAllFloorsController,
  getAvailableStaffController,
  getFloorStaffController,
  updateFloorController,
} from "../controllers/floor.controller";
import { assignStaffToFloorController } from "../controllers/floor.controller";
import { removeStaffFromFloorController } from "../controllers/floor.controller";
import {
  getAllLeavesController,
  updateLeaveStatusController,
} from "../controllers/leave.controller";
import {
  getLateAttendanceController,
  getStaffAttendanceController,
} from "../controllers/attendance.controller";
import {
  generatePayslipController,
  getPayrollController,
} from "../controllers/payrole.controller";
import {
  getProfileDetailsController,
  updateProfileDetailsController,
} from "../controllers/profile.controller";
import { createBranchController } from "../controllers/branch.controller";
import {
  getAdminNotificationsController,
  getNotificationMonthsController,
  getNotificationReadReceiptsController,
  searchStaffController,
  sendAllStaffNotificationController,
  sendPersonalNotificationController,
} from "../controllers/notification.controller";
import {
  readRateLimit,
  writeRateLimit,
  heavyRateLimit,
  searchRateLimit,
  notificationRateLimit,
} from "../utils/rateLimiting";

const router = Router();

router.post(
  "/createDepartment",
  protect,
  adminOnly,
  writeRateLimit,
  createDepartment
);
router.get(
  "/fetchDepartment",
  protect,
  adminOnly,
  readRateLimit,
  fetchDepartmentController
);
router.post("/create-staff", protect, adminOnly, writeRateLimit, createStaff);
router.get(
  "/dashboard/stats",
  protect,
  adminOnly,
  readRateLimit,
  getStatusController
);
router.get(
  "/getAllStaff",
  protect,
  adminOnly,
  readRateLimit,
  getAllStaffController
);
router.get(
  "/getStaff/:staffId",
  protect,
  adminOnly,
  readRateLimit,
  getStaffByIdController
);

router.patch(
  "/updateStaff/:staffId",
  protect,
  adminOnly,
  writeRateLimit,
  updateStaffController
);
router.delete(
  "/deleteStaff/:staffId",
  protect,
  adminOnly,
  writeRateLimit,
  deleteStaffController
);

router.get(
  "/getDepartment/:departmentId",
  protect,
  adminOnly,
  readRateLimit,
  getDepartmentByIdController
);
router.patch(
  "/updateDepartment/:departmentId",
  protect,
  adminOnly,
  writeRateLimit,
  updateDepartmentController
);
router.delete(
  "/deleteDepartment/:departmentId",
  protect,
  adminOnly,
  writeRateLimit,
  deleteDepartmentController
);

router.get(
  "/branches",
  protect,
  adminOnly,
  readRateLimit,
  getAllBranchesController
);
router.get(
  "/attendance/today",
  protect,
  adminOnly,
  readRateLimit,
  getTodayAttendanceDataController
);

router.post(
  "/createFloors",
  protect,
  adminOnly,
  writeRateLimit,
  createFloorController
);
router.get(
  "/getAllFloors",
  protect,
  adminOnly,
  readRateLimit,
  getAllFloorsController
);
router.patch(
  "/floors/:id",
  protect,
  adminOnly,
  writeRateLimit,
  updateFloorController
);
router.delete(
  "/floors/:id",
  protect,
  adminOnly,
  writeRateLimit,
  deleteFloorController
);

router.get(
  "/floors/:floorId/available-staff",
  protect,
  adminOnly,
  readRateLimit,
  getAvailableStaffController
);
router.post(
  "/floors/:floorId/assign",
  protect,
  adminOnly,
  writeRateLimit,
  assignStaffToFloorController
);
router.get(
  "/floors/:floorId/staff",
  protect,
  adminOnly,
  readRateLimit,
  getFloorStaffController
);
router.delete(
  "/floors/:floorId/staff/:staffId",
  protect,
  adminOnly,
  writeRateLimit,
  removeStaffFromFloorController
);

router.patch(
  "/leaves/:leaveId/status",
  protect,
  adminOnly,
  writeRateLimit,
  updateLeaveStatusController
);
router.get(
  "/all-leaves",
  protect,
  adminOnly,
  readRateLimit,
  getAllLeavesController
);

router.get(
  "/staff/:staffId/attendance",
  protect,
  adminOnly,
  readRateLimit,
  getStaffAttendanceController
);

router.get(
  "/payroll",
  protect,
  adminOnly,
  heavyRateLimit,
  getPayrollController
);
router.post(
  "/payroll/generate-payslip",
  protect,
  adminOnly,
  heavyRateLimit,
  generatePayslipController
);

router.patch(
  "/toggleDepartmentStatus/:departmentId",
  protect,
  adminOnly,
  writeRateLimit,
  toggleDepartmentStatusController
);

router.get(
  "/profile-settings/get-profile",
  protect,
  adminOnly,
  readRateLimit,
  getProfileDetailsController
);
router.put(
  "/profile-settings/update-profile",
  protect,
  adminOnly,
  writeRateLimit,
  updateProfileDetailsController
);

router.post(
  "/create-branch",
  protect,
  adminOnly,
  writeRateLimit,
  createBranchController
);
router.delete(
  "/branches/:branchId",
  protect,
  adminOnly,
  writeRateLimit,
  deleteBranchController
);

router.patch(
  "/staff/:staffId/status",
  protect,
  adminOnly,
  writeRateLimit,
  toggleStaffStatusController
);

router.post(
  "/notifications/send-all",
  protect,
  adminOnly,
  notificationRateLimit,
  sendAllStaffNotificationController
);
router.post(
  "/notifications/send-personal",
  protect,
  adminOnly,
  notificationRateLimit,
  sendPersonalNotificationController
);
router.get(
  "/notifications",
  protect,
  adminOnly,
  notificationRateLimit,
  getAdminNotificationsController
);
router.get(
  "/notifications/months",
  protect,
  adminOnly,
  readRateLimit,
  getNotificationMonthsController
);
router.get(
  "/notifications/:id/receipts",
  protect,
  adminOnly,
  readRateLimit,
  getNotificationReadReceiptsController
);

router.get(
  "/staff/search",
  protect,
  adminOnly,
  searchRateLimit,
  searchStaffController
);

router.get("/attendance/late", protect, adminOnly, getLateAttendanceController);

export default router;
