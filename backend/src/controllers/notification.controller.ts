import { getNotificationReadReceiptsService } from "./../Service/notification.service";
import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createNotificationService,
  getAdminNotificationsService,
  getNotificationMonthsService,
  getStaffNotificationsService,
  getUnreadNotificationCountService,
  markAllNotificationsReadService,
  markNotificationReadService,
  searchStaffService,
} from "../Service/notification.service";

export const sendAllStaffNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const createdById = req.user!.userId;

    const result = await createNotificationService({
      organizationId,
      createdById,
      ...req.body,
    });

    res.status(201).json({
      message: "Notification sent successfully",
    });
  }
);

export const sendPersonalNotificationController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const createdById = req.user!.userId;

    const result = await createNotificationService({
      organizationId,
      createdById,
      ...req.body,
      type: "PERSONAL",
    });

    res.status(201).json({
      message: "Notification sent successfully",
      data: result,
    });
  }
);

export const searchStaffController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const search = String(req.query.search || "");

    const result = await searchStaffService(organizationId, search);

    res.status(200).json({
      data: result,
    });
  }
);

export const getStaffNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const result = await getStaffNotificationsService({
      userId,
      organizationId,
    });

    res.status(200).json({
      data: result.notifications,

      unreadCount: result.unreadCount,

      total: result.total,
    });
  }
);

export const markNotificationReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const notificationId = Number(req.params.notificationId);

    await markNotificationReadService({
      notificationId,
      userId,
    });

    res.status(200).json({
      message: "Notification marked as read",
    });
  }
);

export const getUnreadNotificationCountController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    const unreadCount = await getUnreadNotificationCountService({
      userId,
      organizationId,
    });

    res.status(200).json({
      unreadCount,
    });
  }
);

export const markAllNotificationsReadController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.userId;

    const organizationId = req.user!.organizationId;

    await markAllNotificationsReadService({
      userId,
      organizationId,
    });

    res.status(200).json({
      message: "All notifications marked as read",
    });
  }
);

export const getAdminNotificationsController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const month = req.query.month ? Number(req.query.month) : undefined;

    const year = req.query.year ? Number(req.query.year) : undefined;

    const type = req.query.type as "ALL" | "PERSONAL" | "all" | undefined;

    const search = String(req.query.search || "");

    const result = await getAdminNotificationsService({
      organizationId,
      month,
      year,
      type,
      search,
    });

    res.status(200).json({
      data: result,
    });
  }
);

export const getNotificationMonthsController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const months = await getNotificationMonthsService(organizationId);

    res.status(200).json({
      months,
    });
  }
);

export const getNotificationReadReceiptsController = asyncHandler(
  async (req: Request, res: Response) => {
    const organizationId = req.user!.organizationId;

    const notificationId = Number(req.params.id);

    const result = await getNotificationReadReceiptsService(
      organizationId,
      notificationId
    );

    res.status(200).json(result);
  }
);
