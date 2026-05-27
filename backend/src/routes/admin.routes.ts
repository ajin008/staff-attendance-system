import { Router } from "express";
import { adminOnly, protect } from "../middleware/protect";
import {
  createDepartment,
  deleteDepartmentController,
  fetchDepartmentController,
  getDepartmentByIdController,
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

import { getAllBranchesController } from "../controllers/branch.controller";
import { getTodayAttendanceController } from "../controllers/staff.controller";
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

export default router;
