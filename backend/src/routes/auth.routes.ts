import { Router } from "express";
import {
  // createStaff,
  deleteStaff,
  getAllStaff,
  login,
  logout,
  register,
  // seedAdmin,
  updateStaff,
} from "../controllers/auth.controller";
import { adminOnly, protect } from "../middleware/protect";
import { loginRateLimit } from "../utils/rateLimiting";

const router = Router();
console.log("auth route triggering");

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
// router.post("/seed-admin", seedAdmin);

// router.post("/create-staff", protect, adminOnly, createStaff);
router.get("/staff", protect, adminOnly, getAllStaff);
router.delete("/staff/:staffId", protect, adminOnly, deleteStaff);
router.patch("/staff/:staffId", protect, adminOnly, updateStaff);

export default router;
