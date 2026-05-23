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
} from "../controllers/admin.controller";

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

export default router;
