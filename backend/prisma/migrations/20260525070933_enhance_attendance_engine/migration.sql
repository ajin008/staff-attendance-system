/*
  Warnings:

  - You are about to drop the column `status` on the `Attendance` table. All the data in the column will be lost.
  - You are about to drop the column `totalWorkHours` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "status",
DROP COLUMN "totalWorkHours",
ADD COLUMN     "attendanceStatus" TEXT NOT NULL DEFAULT 'present',
ADD COLUMN     "earlyExitMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isEarlyExit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isHalfDay" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isLate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isOvertime" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lateMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "overtimeMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shiftEnd" TEXT,
ADD COLUMN     "shiftStart" TEXT,
ADD COLUMN     "totalWorkMinutes" INTEGER NOT NULL DEFAULT 0;
