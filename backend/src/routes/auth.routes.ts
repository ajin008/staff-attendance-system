import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller";
import { protect } from "../middleware/protect";
import {
  authRateLimit,
  writeRateLimit,
  readRateLimit,
} from "../utils/rateLimiting";

const router = Router();

router.post("/login", authRateLimit, login);
router.post("/register", writeRateLimit, register);
router.post("/logout", readRateLimit, protect, logout);

export default router;
