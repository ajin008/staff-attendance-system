import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ENV from "../config/rootVariables.js";
import { findUserById } from "../Repository/user.repository.js";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;

        organizationId: number;

        role: "admin" | "staff";

        name: string;

        staffId: string | null;
      };
    }
  }
}

interface jwtPayload {
  userId: number;

  organizationId: number;

  role: "admin" | "staff";
}

export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log("Checking authentication...");
    const token = req.cookies.token;
    // console.log("Token from cookies:", token);

    if (!token) {
      res.status(401).json({ message: "Not authorized  no token" });
      return;
    }

    // console.log("JWT_SECRET exists:", !!ENV.JWT_SECRET);
    // console.log("JWT_SECRET length:", ENV.JWT_SECRET?.length);

    const decoded = jwt.verify(token, ENV.JWT_SECRET!) as jwtPayload;
    const user = await findUserById(decoded.userId);

    // console.log("Decoded token:", decoded);
    // console.log("User from DB:", user);

    if (!user) {
      res.status(401).json({ message: "User no longer exists" });
      return;
    }

    req.user = {
      userId: user.id,

      organizationId: user.organizationId,

      role: user.role,

      name: user.name,

      staffId: user.staffId,
    };
    // console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("Checking admin access for user:", req.user?.name);
  if (req.user?.role !== "admin") {
    res.status(403).json({ message: "Admin access only" });
    return;
  }
  console.log("Admin access granted for user:", req.user?.name);
  next();
};
