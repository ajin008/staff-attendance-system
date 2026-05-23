import { Router } from "express";
import { adminOnly, protect } from "../middleware/protect";
import { createDepartment } from "../controllers/department.controller";

const router = Router();

router.post("/createDepartment", protect, adminOnly, createDepartment);

export default router;
