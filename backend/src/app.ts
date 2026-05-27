import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";

import adminRouter from "./routes/admin.routes";
import staffRouter from "./routes/staff.routes";
import { errorHandler } from "./middleware/errorHandler";
import { generalRateLimit } from "./utils/rateLimiting";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use("/uploads", express.static("uploads"));

app.use(express.json());
app.use(cookieParser());

// app.use(generalRateLimit);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);

app.use(errorHandler);

export default app;
