import api from "../lib/axios";
import { ENDPOINT } from "../utils/endPoint";
import { Staff } from "../types";

export interface SendAllStaffNotificationData {
  title: string;
  message: string;
  type: "ALL";
}

export interface SendPersonalNotificationData {
  title: string;
  message: string;
  type: "PERSONAL";
  targetUserId: number;
}

export interface StaffNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface StaffNotificationsResponse {
  data: StaffNotification[];
  unreadCount?: number;
  total?: number;
}

export type SendNotificationData =
  | SendAllStaffNotificationData
  | SendPersonalNotificationData;

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  type: "ALL" | "PERSONAL";
  targetUserId?: number;
  createdBy: number;
  createdAt: string;
}

export const sendAllStaffNotification = async (
  data: SendAllStaffNotificationData
): Promise<NotificationResponse> => {
  console.log("Sending all staff notification with data:", data);
  const response = await api.post(ENDPOINT.SEND_ALL_STAFF_NOTIFICATION, data);
  return response.data;
};

export const sendPersonalNotification = async (
  data: SendPersonalNotificationData
): Promise<NotificationResponse> => {
  const response = await api.post(ENDPOINT.SEND_PERSONAL_NOTIFICATION, data);
  return response.data;
};

export const searchStaffMembers = async (
  searchTerm: string
): Promise<{ data: Staff[] }> => {
  const response = await api.get(ENDPOINT.SEARCH_STAFF, {
    params: { search: searchTerm },
  });
  return response.data;
};

export const getNotificationHistory = async (params?: {
  type?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: NotificationResponse[] }> => {
  const response = await api.get(ENDPOINT.GET_NOTIFICATIONS, { params });
  return response.data;
};

// staff notifications

export interface StaffNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface StaffNotificationsResponse {
  data: StaffNotification[];
  unreadCount?: number;
  total?: number;
}

// Get all notifications for staff
export const getStaffNotifications =
  async (): Promise<StaffNotificationsResponse> => {
    const response = await api.get(ENDPOINT.STAFF_NOTIFICATIONS);
    return response.data;
  };

// Mark a single notification as read
export const markStaffNotificationAsRead = async (
  notificationId: number
): Promise<void> => {
  await api.patch(ENDPOINT.MARK_STAFF_NOTIFICATION_READ(notificationId));
};

// Mark all notifications as read
export const markAllStaffNotificationsAsRead = async (): Promise<void> => {
  await api.patch(ENDPOINT.MARK_ALL_STAFF_NOTIFICATIONS_READ);
};

// Get unread count only
export const getUnreadNotificationCount = async (): Promise<{
  unreadCount: number;
}> => {
  const response = await api.get(ENDPOINT.STAFF_NOTIFICATIONS_UNREAD_COUNT);
  return response.data;
};

//admin side

export interface StaffNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt?: string;
}

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: "ALL" | "PERSONAL";
  targetUserId?: number;
  targetUser?: {
    id: number;
    name: string;
    staffId: string;
    email: string;
  };
  createdBy: number;
  createdAt: string;
  isRead?: boolean;
  readReceipts?: {
    total: number;
    read: number;
    unread: number;
    percentage: number;
    recentReaders: Array<{
      id: number;
      name: string;
      staffId: string;
      readAt: string;
    }>;
  };
}

export interface AdminNotificationsResponse {
  data: AdminNotification[];
  unreadCount?: number;
  total?: number;
}

export interface GetNotificationsParams {
  month?: number;
  year?: number;
  type?: "ALL" | "PERSONAL" | "all";
  search?: string;
}

// Get all notifications with filters
export const getAdminNotifications = async (
  params: GetNotificationsParams
): Promise<AdminNotificationsResponse> => {
  const response = await api.get(ENDPOINT.ADMIN_NOTIFICATIONS, { params });
  return response.data;
};

// Get available months with notification data
export const getNotificationMonths = async (): Promise<{
  months: Array<{ month: number; year: number; count: number }>;
}> => {
  const response = await api.get(ENDPOINT.NOTIFICATION_MONTHS);
  return response.data;
};

// Get notification read receipts
export const getNotificationReadReceipts = async (
  notificationId: number
): Promise<AdminNotification["readReceipts"]> => {
  const response = await api.get(
    ENDPOINT.NOTIFICATION_READ_RECEIPTS(notificationId)
  );
  return response.data;
};
