import { Router } from "express";
import {
  // createStaff,

  login,
  logout,
  register,
  // seedAdmin,
} from "../controllers/auth.controller";
import { adminOnly, protect } from "../middleware/protect";
import { loginRateLimit } from "../utils/rateLimiting";

const router = Router();
console.log("auth route triggering");

router.post("/login", login);
router.post("/register", loginRateLimit, register);
router.post("/logout", logout);
// router.post("/seed-admin", seedAdmin);

// router.post("/create-staff", protect, adminOnly, createStaff);

export default router;
