import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

import adminRouter from "./routes/admin.routes.js";
import staffRouter from "./routes/staff.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
// import { generalRateLimit } from "./utils/rateLimiting.js";

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
