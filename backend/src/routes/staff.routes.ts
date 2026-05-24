import { Router } from "express";
import { protect } from "../middleware/protect";
import { checkInStaffController } from "../controllers/staff.controller";
const router = Router();

router.post("/check-in", protect, checkInStaffController);

export default router;
