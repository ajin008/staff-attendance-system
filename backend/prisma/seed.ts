import "dotenv/config";
import prisma from "../src/utils/prisma";

const seedAttendance = async () => {
  console.log("Seeding attendance...");

  // GET ALL STAFF
  const staff = await prisma.user.findMany({
    where: {
      role: "staff",
    },

    include: {
      department: true,
    },
  });

  console.log(`Found ${staff.length} staff`);

  // MAY 2026
  const year = 2026;

  const month = 4; // MAY (0-based)

  for (const user of staff) {
    console.log(`Seeding for ${user.name}`);

    for (let day = 1; day <= 31; day++) {
      const currentDate = new Date(year, month, day);

      // SKIP INVALID DATES
      if (currentDate.getMonth() !== month) {
        continue;
      }

      // WEEKDAY
      const weekday = currentDate
        .toLocaleDateString("en-US", {
          weekday: "long",
        })
        .toLowerCase();

      // SKIP WEEKLY OFFS
      const weeklyOffs = user.department?.weeklyOffDays || [];

      if (weeklyOffs.includes(weekday)) {
        console.log(`Skipping weekly off for ${user.name} on ${weekday}`);

        continue;
      }

      // RANDOM ABSENT
      const absentChance = Math.random();

      if (absentChance < 0.1) {
        console.log(`${user.name} absent on ${currentDate.toDateString()}`);

        continue;
      }

      // CHECK-IN
      const checkIn = new Date(currentDate);

      const lateRandom = Math.floor(Math.random() * 60);

      checkIn.setHours(9, lateRandom, 0, 0);

      // RANDOM HALF DAY
      const halfDayChance = Math.random();

      let checkOut = new Date(currentDate);

      if (halfDayChance < 0.1) {
        // HALF DAY
        checkOut.setHours(13, 0, 0, 0);
      } else {
        // NORMAL / OVERTIME
        checkOut.setHours(17 + Math.floor(Math.random() * 3), 0, 0, 0);
      }

      // WORK MINUTES
      const totalWorkMinutes = Math.floor(
        (checkOut.getTime() - checkIn.getTime()) / (1000 * 60)
      );

      // LATE
      const lateMinutes = Math.max(0, lateRandom - 15);

      // HALF DAY
      const isHalfDay = totalWorkMinutes < 240;

      // OVERTIME
      const overtimeMinutes =
        totalWorkMinutes > 480 ? totalWorkMinutes - 480 : 0;

      // ATTENDANCE STATUS
      let attendanceStatus = "present";

      if (isHalfDay) {
        attendanceStatus = "half-day";
      }

      // CREATE ATTENDANCE
      // CREATE ATTENDANCE
      await prisma.attendance.create({
        data: {
          userId: user.id,

          organizationId: user.organizationId,

          branchId: user.branchId!,

          // IMPORTANT
          createdAt: currentDate,

          updatedAt: currentDate,

          checkInTime: checkIn,

          checkOutTime: checkOut,

          checkInLatitude: 10.8505,

          checkInLongitude: 76.2711,

          checkOutLatitude: 10.8505,

          checkOutLongitude: 76.2711,

          shiftStart: user.shiftStart || user.department?.shiftStart || "09:00",

          shiftEnd: user.shiftEnd || user.department?.shiftEnd || "17:00",

          totalWorkMinutes,

          lateMinutes,

          overtimeMinutes,

          attendanceStatus,

          isLate: lateMinutes > 0,

          isHalfDay,

          isOvertime: overtimeMinutes > 0,
        },
      });

      console.log(
        `Attendance created for ${user.name} - ${currentDate.toDateString()}`
      );
    }
  }

  console.log("Attendance seeding completed");
};

seedAttendance()
  .catch((err) => {
    console.error("Seed failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
