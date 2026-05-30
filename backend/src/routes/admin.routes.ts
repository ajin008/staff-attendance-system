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
import { getStaffAttendanceController } from "../controllers/attendance.controller";
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

const router = Router();

router.post("/createDepartment", protect, adminOnly, createDepartment);
router.get("/fetchDepartment", protect, adminOnly, fetchDepartmentController);
router.post("/create-staff", protect, adminOnly, createStaff);
router.get("/dashboard/stats", protect, adminOnly, getStatusController);
router.get("/getAllStaff", protect, adminOnly, getAllStaffController);
router.get("/getStaff/:staffId", protect, adminOnly, getStaffByIdController);

router.patch(
  "/updateStaff/:staffId",
  protect,
  adminOnly,
  updateStaffController
);

router.delete(
  "/deleteStaff/:staffId",
  protect,
  adminOnly,
  deleteStaffController
);

router.get(
  "/getDepartment/:departmentId",
  protect,
  adminOnly,
  getDepartmentByIdController
);

router.patch(
  "/updateDepartment/:departmentId",
  protect,
  adminOnly,
  updateDepartmentController
);

router.delete(
  "/deleteDepartment/:departmentId",
  protect,
  adminOnly,
  deleteDepartmentController
);

router.get("/branches", protect, adminOnly, getAllBranchesController);

router.get(
  "/attendance/today",
  protect,
  adminOnly,
  getTodayAttendanceDataController
);

router.post("/createFloors", protect, adminOnly, createFloorController);

router.get("/getAllFloors", protect, adminOnly, getAllFloorsController);

router.patch("/floors/:id", protect, adminOnly, updateFloorController);

router.delete("/floors/:id", protect, adminOnly, deleteFloorController);

router.get(
  "/floors/:floorId/available-staff",
  protect,
  adminOnly,
  getAvailableStaffController
);

// routes/admin.routes.ts

router.post(
  "/floors/:floorId/assign",
  protect,
  adminOnly,
  assignStaffToFloorController
);

router.get(
  "/floors/:floorId/staff",
  protect,
  adminOnly,
  getFloorStaffController
);

router.delete(
  "/floors/:floorId/staff/:staffId",
  protect,
  adminOnly,
  removeStaffFromFloorController
);

router.patch(
  "/leaves/:leaveId/status",
  protect,
  adminOnly,
  updateLeaveStatusController
);

router.get("/all-leaves", protect, adminOnly, getAllLeavesController);

router.get(
  "/staff/:staffId/attendance",
  protect,
  adminOnly,
  getStaffAttendanceController
);

router.get("/payroll", protect, adminOnly, getPayrollController);

router.post(
  "/payroll/generate-payslip",
  protect,
  adminOnly,
  generatePayslipController
);

router.patch(
  "/toggleDepartmentStatus/:departmentId",
  protect,
  adminOnly,
  toggleDepartmentStatusController
);
router.get(
  "/profile-settings/get-profile",
  protect,
  adminOnly,
  getProfileDetailsController
);

router.put(
  "/profile-settings/update-profile",
  protect,
  adminOnly,
  updateProfileDetailsController
);

router.post("/create-branch", protect, adminOnly, createBranchController);

router.delete("/branches/:branchId", protect, adminOnly);

router.delete(
  "/branches/:branchId",
  protect,
  adminOnly,
  deleteBranchController
);

router.patch(
  "/staff/:staffId/status",
  protect,
  adminOnly,
  toggleStaffStatusController
);

router.post(
  "/notifications/send-all",
  protect,
  adminOnly,
  sendAllStaffNotificationController
);

router.get("/staff/search", protect, adminOnly, searchStaffController);
router.post(
  "/notifications/send-personal",
  protect,
  adminOnly,
  sendPersonalNotificationController
);

router.get(
  "/notifications",
  protect,
  adminOnly,
  getAdminNotificationsController
);

router.get(
  "/notifications/months",
  protect,
  adminOnly,
  getNotificationMonthsController
);
router.get(
  "/notifications/:id/receipts",
  protect,
  adminOnly,
  getNotificationReadReceiptsController
);

export default router;
