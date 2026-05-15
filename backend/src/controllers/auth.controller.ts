import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import ENV from "../config/rootVariables";
import {
  createStaffService,
  deleteStaffService,
  getAllStaffService,
  loginService,
  seedAdminService,
  updateStaffService,
} from "../Service/auth.service";

const setCookies = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const login = asyncHandler(async (req: Request, res: Response) => {
  // console.log("Login request received with body:", req.body);
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    res.status(400).json({ message: "All fields required" });
    return;
  }

  const { user, token } = await loginService(identifier, password);

  setCookies(res, token);
  // console.log("Login successful for user:", user);
  res.status(200).json({
    message: "Login successful",
    user,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

export const createStaff = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, joinedOn, phone } = req.body;

  if (!name || !email || !password || !joinedOn || !phone) {
    res.status(400).json({ message: "All fields required" });
    return;
  }

  const result = await createStaffService({
    name,
    email,
    password,
    joinedOn,
    phone,
  });

  res.status(201).json(result);
});

export const getAllStaff = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = (req.query.search as string) || "";

  const result = await getAllStaffService(page, limit, search);
  res.status(200).json(result);
});

export const deleteStaff = asyncHandler(async (req: Request, res: Response) => {
  const staffId = req.params.staffId as string;

  await deleteStaffService(staffId);

  res.status(200).json({ message: "Staff deleted successfully" });
});

export const seedAdmin = asyncHandler(async (_req: Request, res: Response) => {
  const result = await seedAdminService();
  res.status(201).json(result);
});

export const updateStaff = asyncHandler(async (req: Request, res: Response) => {
  console.log("update staff service is not triggering");
  const staffId = req.params.staffId as string;
  const { name, email, password, phone } = req.body;
  const result = await updateStaffService(staffId, {
    name,
    email,
    password,
    phone,
  });
  res.status(200).json({ message: "Staff updated", user: result });
});
