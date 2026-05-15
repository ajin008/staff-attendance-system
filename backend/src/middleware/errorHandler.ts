import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _Next: NextFunction
) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  console.error("[UNEXPECTED ERROR]", err);
  res.status(500).json({ message: "Internal server error" });
};
