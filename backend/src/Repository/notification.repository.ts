import prisma from "../utils/prisma.js";
import { NotificationType } from "@prisma/client";

interface CreateNotificationInput {
  organizationId: number;

  title: string;

  message: string;

  createdById: number;

  type: NotificationType;

  targetUserId?: number;
}

export const createNotification = async (data: {
  organizationId: number;

  createdById: number;

  title: string;

  message: string;

  type: NotificationType;

  targetUserId?: number;

  expiresAt: Date;
}) => {
  return prisma.notification.create({
    data,
  });
};

export const searchStaffRepository = async (
  organizationId: number,
  search: string
) => {
  return prisma.user.findMany({
    where: {
      organizationId,

      role: "staff",

      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },

        {
          staffId: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,

      staffId: true,

      name: true,

      email: true,

      isActive: true,
    },

    take: 10,

    orderBy: {
      name: "asc",
    },
  });
};

export const createNotificationRead = async (data: {
  notificationId: number;
  userId: number;
}) => {
  return prisma.notificationRead.create({
    data,
  });
};

export const findNotificationsForStaff = async (
  organizationId: number,
  userId: number
) => {
  const notifications = await prisma.notification.findMany({
    where: {
      organizationId,

      expiresAt: {
        gt: new Date(), // only active notifications
      },

      OR: [
        {
          type: "ALL",
        },

        {
          type: "PERSONAL",
          targetUserId: userId,
        },
      ],
    },

    include: {
      reads: {
        where: {
          userId,
        },

        select: {
          id: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications.map((notification) => ({
    id: notification.id,

    title: notification.title,

    message: notification.message,

    createdAt: notification.createdAt,

    expiresAt: notification.expiresAt,

    isRead: notification.reads.length > 0,
  }));
};

export const findNotificationById = async (notificationId: number) => {
  return prisma.notification.findUnique({
    where: {
      id: notificationId,
    },
  });
};

export const findNotificationReadByUserAndNotification = async (
  notificationId: number,
  userId: number
) => {
  return prisma.notificationRead.findUnique({
    where: {
      notificationId_userId: {
        notificationId,
        userId,
      },
    },
  });
};

export const findNotificationsForMarkAllRead = async (
  organizationId: number,
  userId: number
) => {
  return prisma.notification.findMany({
    where: {
      organizationId,

      OR: [
        {
          type: "ALL",
        },
        {
          type: "PERSONAL",
          targetUserId: userId,
        },
      ],

      reads: {
        none: {
          userId,
        },
      },
    },

    select: {
      id: true,
    },
  });
};

export const createManyNotificationReads = async (
  data: {
    notificationId: number;
    userId: number;
  }[]
) => {
  return prisma.notificationRead.createMany({
    data,

    skipDuplicates: true,
  });
};

export const countUnreadNotifications = async (
  organizationId: number,
  userId: number
) => {
  return prisma.notification.count({
    where: {
      organizationId,

      OR: [
        {
          type: "ALL",
        },
        {
          type: "PERSONAL",
          targetUserId: userId,
        },
      ],

      reads: {
        none: {
          userId,
        },
      },
    },
  });
};

export const findAdminNotifications = async ({
  organizationId,
  month,
  year,
  type,
  search,
}: {
  organizationId: number;

  month?: number;

  year?: number;

  type?: "ALL" | "PERSONAL" | "all";

  search?: string;
}) => {
  let startDate: Date | undefined;

  let endDate: Date | undefined;

  if (month && year) {
    startDate = new Date(year, month - 1, 1);

    endDate = new Date(year, month, 1);
  }

  const notifications = await prisma.notification.findMany({
    where: {
      organizationId,

      ...(type &&
        type !== "all" && {
          type,
        }),

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },

          {
            message: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(startDate &&
        endDate && {
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        }),
    },

    include: {
      targetUser: {
        select: {
          id: true,

          name: true,

          staffId: true,

          email: true,
        },
      },

      reads: {
        include: {
          user: {
            select: {
              id: true,

              name: true,

              staffId: true,
            },
          },
        },

        orderBy: {
          readAt: "desc",
        },

        take: 5,
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return notifications.map((notification) => ({
    id: notification.id,

    title: notification.title,

    message: notification.message,

    type: notification.type,

    targetUserId: notification.targetUserId,

    targetUser: notification.targetUser,

    createdBy: notification.createdById,

    createdAt: notification.createdAt,

    expiresAt: notification.expiresAt,

    readReceipts: {
      total: notification.type === "PERSONAL" ? 1 : undefined,

      read: notification.reads.length,

      recentReaders: notification.reads.map((read) => ({
        id: read.user.id,

        name: read.user.name,

        staffId: read.user.staffId,

        readAt: read.readAt,
      })),
    },
  }));
};

export const getNotificationMonthsRepository = async (
  organizationId: number
) => {
  const notifications = await prisma.notification.findMany({
    where: {
      organizationId,
    },

    select: {
      createdAt: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const grouped = new Map<
    string,
    {
      month: number;
      year: number;
      count: number;
    }
  >();

  notifications.forEach((notification) => {
    const date = new Date(notification.createdAt);

    const month = date.getMonth() + 1;

    const year = date.getFullYear();

    const key = `${year}-${month}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        month,
        year,
        count: 0,
      });
    }

    grouped.get(key)!.count += 1;
  });

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year;
    }

    return b.month - a.month;
  });
};

export const getNotificationReadReceiptsRepository = async (
  organizationId: number,
  notificationId: number
) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id: notificationId,
    },

    include: {
      reads: {
        include: {
          user: {
            select: {
              id: true,

              name: true,

              staffId: true,
            },
          },
        },

        orderBy: {
          readAt: "desc",
        },
      },
    },
  });

  if (!notification) {
    return null;
  }

  let totalRecipients = 0;

  if (notification.type === "PERSONAL") {
    totalRecipients = 1;
  } else {
    totalRecipients = await prisma.user.count({
      where: {
        organizationId,

        role: "staff",

        isActive: true,
      },
    });
  }

  const readCount = notification.reads.length;

  const unreadCount = totalRecipients - readCount;

  return {
    total: totalRecipients,

    read: readCount,

    unread: unreadCount,

    percentage:
      totalRecipients > 0 ? Math.round((readCount / totalRecipients) * 100) : 0,

    recentReaders: notification.reads.map((read) => ({
      id: read.user.id,

      name: read.user.name,

      staffId: read.user.staffId,

      readAt: read.readAt,
    })),
  };
};
