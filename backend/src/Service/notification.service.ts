import AppError from "../utils/AppError";
import {
  countUnreadNotifications,
  createManyNotificationReads,
  createNotification,
  createNotificationRead,
  findAdminNotifications,
  findNotificationById,
  findNotificationReadByUserAndNotification,
  findNotificationsForMarkAllRead,
  findNotificationsForStaff,
  getNotificationMonthsRepository,
  getNotificationReadReceiptsRepository,
  searchStaffRepository,
} from "../Repository/notification.repository";

interface CreateNotificationInput {
  organizationId: number;

  createdById: number;

  title: string;

  message: string;

  type: "ALL" | "PERSONAL";

  targetUserId?: number;
}

export const createNotificationService = async (
  input: CreateNotificationInput
) => {
  const { title, message, type, targetUserId, organizationId, createdById } =
    input;

  if (!title.trim()) {
    throw new AppError("Title is required", 400);
  }

  if (!message.trim()) {
    throw new AppError("Message is required", 400);
  }

  if (type === "PERSONAL" && !targetUserId) {
    throw new AppError("Target user is required", 400);
  }

  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + 7);

  return createNotification({
    organizationId,
    createdById,
    title,
    message,
    type,
    targetUserId,
    expiresAt,
  });
};

export const searchStaffService = async (
  organizationId: number,
  search: string
) => {
  if (!search.trim()) {
    return [];
  }

  return searchStaffRepository(organizationId, search.trim());
};

export const getStaffNotificationsService = async ({
  userId,
  organizationId,
}: {
  userId: number;

  organizationId: number;
}) => {
  const notifications = await findNotificationsForStaff(organizationId, userId);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  return {
    notifications,

    unreadCount,

    total: notifications.length,
  };
};

export const markNotificationReadService = async ({
  notificationId,
  userId,
}: {
  notificationId: number;
  userId: number;
}) => {
  const notification = await findNotificationById(notificationId);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  const existingRead = await findNotificationReadByUserAndNotification(
    notificationId,
    userId
  );

  if (existingRead) {
    return;
  }

  await createNotificationRead({
    notificationId,
    userId,
  });
};

export const getUnreadNotificationCountService = async ({
  userId,
  organizationId,
}: {
  userId: number;
  organizationId: number;
}) => {
  return countUnreadNotifications(organizationId, userId);
};

export const markAllNotificationsReadService = async ({
  userId,
  organizationId,
}: {
  userId: number;
  organizationId: number;
}) => {
  const notifications = await findNotificationsForMarkAllRead(
    organizationId,
    userId
  );

  if (!notifications.length) {
    return;
  }

  await createManyNotificationReads(
    notifications.map((notification) => ({
      notificationId: notification.id,
      userId,
    }))
  );
};

interface GetAdminNotificationsInput {
  organizationId: number;

  month?: number;

  year?: number;

  type?: "ALL" | "PERSONAL" | "all";

  search?: string;
}

export const getAdminNotificationsService = async (
  input: GetAdminNotificationsInput
) => {
  return findAdminNotifications(input);
};

export const getNotificationMonthsService = async (organizationId: number) => {
  return getNotificationMonthsRepository(organizationId);
};

export const getNotificationReadReceiptsService = async (
  organizationId: number,
  notificationId: number
) => {
  const notification = await findNotificationById(notificationId);

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  if (notification.organizationId !== organizationId) {
    throw new AppError("Notification not found", 404);
  }

  return getNotificationReadReceiptsRepository(organizationId, notificationId);
};
