import "dotenv/config";
import prisma from "../src/utils/prisma";

const ORGANIZATION_ID = 7;

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const seedAttendance = async () => {
  const staff = await prisma.user.findMany({
    where: {
      organizationId: ORGANIZATION_ID,
      role: "staff",
    },

    include: {
      department: true,
      branch: true,
    },
  });

  console.log(`Found ${staff.length} staff`);

  const startDate = new Date("2026-01-01");

  const endDate = new Date("2026-05-28");

  for (const user of staff) {
    console.log(`Seeding attendance for ${user.name}`);

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const weekday = currentDate
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase();

      const weeklyOffs = user.department?.weeklyOffDays || [];

      if (weeklyOffs.includes(weekday)) {
        currentDate.setDate(currentDate.getDate() + 1);

        continue;
      }

      // 10% absent
      if (Math.random() < 0.1) {
        currentDate.setDate(currentDate.getDate() + 1);

        continue;
      }

      const checkIn = new Date(currentDate);

      const lateMinutes = random(0, 45);

      checkIn.setHours(9, lateMinutes, 0, 0);

      const checkOut = new Date(currentDate);

      let isHalfDay = false;

      if (Math.random() < 0.08) {
        isHalfDay = true;

        checkOut.setHours(13, 0, 0, 0);
      } else {
        checkOut.setHours(17 + random(0, 2), 0, 0, 0);
      }

      const totalWorkMinutes = Math.floor(
        (checkOut.getTime() - checkIn.getTime()) / 60000
      );

      const overtimeMinutes =
        totalWorkMinutes > 480 ? totalWorkMinutes - 480 : 0;

      await prisma.attendance.create({
        data: {
          userId: user.id,

          organizationId: ORGANIZATION_ID,

          branchId: user.branchId!,

          checkInTime: checkIn,

          checkOutTime: checkOut,

          checkInLatitude: user.branch?.latitude,

          checkInLongitude: user.branch?.longitude,

          checkOutLatitude: user.branch?.latitude,

          checkOutLongitude: user.branch?.longitude,

          shiftStart: user.shiftStart || "09:00",

          shiftEnd: user.shiftEnd || "17:00",

          totalWorkMinutes,

          lateMinutes: lateMinutes > 15 ? lateMinutes - 15 : 0,

          overtimeMinutes,

          attendanceStatus: isHalfDay ? "half-day" : "present",

          isLate: lateMinutes > 15,

          isHalfDay,

          isOvertime: overtimeMinutes > 0,

          createdAt: new Date(currentDate),
        },
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  console.log("Attendance seeding completed");
};

seedAttendance()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
