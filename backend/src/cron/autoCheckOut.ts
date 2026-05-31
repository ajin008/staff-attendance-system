import prisma from "../utils/prisma.js";
import { DateTime } from "luxon";
import {
  calculateEarlyExitMinutes,
  calculateShiftMinutes,
  calculateWorkedMinutes,
} from "../utils/time.js";
import { updateAttendanceCheckOut } from "../Repository/attendance.repository.js";
import { checkOutStaffAllocation } from "../Repository/floor.repository.js";

const ORG_TIMEZONE = process.env.ORG_TIMEZONE || "Asia/Kolkata";
const AUTO_CHECKOUT_GAP_HOURS = 3;

let isAutoCheckoutRunning = false;

export const findPendingAutoCheckouts = async () => {
  const cutoff = DateTime.now()
    .setZone(ORG_TIMEZONE)
    .minus({ days: 2 })
    .startOf("day")
    .toJSDate();

  return prisma.attendance.findMany({
    where: {
      checkOutTime: null,
      checkInTime: { not: null },
      createdAt: { gte: cutoff },
    },
    include: {
      user: {
        include: { department: true },
      },
    },
  });
};

const processAutoCheckout = async (
  attendance: Awaited<ReturnType<typeof findPendingAutoCheckouts>>[number]
) => {
  const shiftEnd = attendance.shiftEnd || attendance.user.department?.shiftEnd;

  if (!shiftEnd || !attendance.shiftStart || !attendance.checkInTime) {
    console.warn(
      `Skipping userId ${attendance.userId}: missing shiftStart/shiftEnd/checkInTime`
    );
    return;
  }

  const checkInLocal = DateTime.fromJSDate(attendance.checkInTime, {
    zone: ORG_TIMEZONE,
  });

  const [shiftHour, shiftMinute] = shiftEnd.split(":").map(Number);

  let autoCheckoutLocal = checkInLocal.set({
    hour: shiftHour + AUTO_CHECKOUT_GAP_HOURS,
    minute: shiftMinute,
    second: 0,
    millisecond: 0,
  });

  if (autoCheckoutLocal <= checkInLocal) {
    autoCheckoutLocal = autoCheckoutLocal.plus({ days: 1 });
  }

  const now = DateTime.now().setZone(ORG_TIMEZONE);

  if (now < autoCheckoutLocal) {
    return;
  }

  const autoCheckoutTime = autoCheckoutLocal.toJSDate();

  const totalWorkMinutes = calculateWorkedMinutes(
    attendance.checkInTime,
    autoCheckoutTime
  );

  const shiftMinutes = calculateShiftMinutes(attendance.shiftStart, shiftEnd);
  const earlyExitMinutes = calculateEarlyExitMinutes(
    shiftEnd,
    autoCheckoutTime
  );
  const isHalfDay = totalWorkMinutes < shiftMinutes / 2;

  await updateAttendanceCheckOut(attendance.id, {
    checkOutTime: autoCheckoutTime,
    totalWorkMinutes,
    overtimeMinutes: 0,
    isOvertime: false,
    earlyExitMinutes,
    isEarlyExit: earlyExitMinutes > 0,
    isHalfDay,
    isAutoCheckout: true,
    attendanceStatus: isHalfDay ? "half_day" : "present",
  });

  await checkOutStaffAllocation(attendance.userId);

  console.log(
    `Auto checkout done: userId=${
      attendance.userId
    } at ${autoCheckoutLocal.toISO()}`
  );
};

export const autoCheckOutStaffService = async () => {
  if (isAutoCheckoutRunning) {
    console.warn("Auto checkout already running, skipping this cycle.");
    return;
  }

  isAutoCheckoutRunning = true;
  console.log("Running auto checkout...");

  try {
    const pendingAttendances = await findPendingAutoCheckouts();
    console.log(`Found ${pendingAttendances.length} pending checkouts.`);

    for (const attendance of pendingAttendances) {
      try {
        await processAutoCheckout(attendance);
      } catch (err) {
        console.error(
          `Auto checkout failed for userId ${attendance.userId}:`,
          err
        );
      }
    }
  } finally {
    isAutoCheckoutRunning = false;
  }
};
