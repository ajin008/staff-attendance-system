// components/admin/notifications/types.ts
export interface Staff {
  id: number;
  name: string;
  email: string;
  staffId: string;
  department?: { name: string };
}

export interface ReadReceipt {
  id: number;
  name: string;
  staffId: string;
  readAt: string;
}

export interface NotificationReadReceipt {
  total: number;
  read: number;
  unread: number;
  percentage: number;
  recentReaders: ReadReceipt[];
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "ALL" | "PERSONAL";
  targetUserId?: number;
  targetUser?: Staff;
  createdBy: number;
  createdAt: string;
  isRead?: boolean;
  readReceipts?: NotificationReadReceipt;
}
