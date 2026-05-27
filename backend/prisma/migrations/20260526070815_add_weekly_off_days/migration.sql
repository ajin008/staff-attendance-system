/*
  Warnings:

  - You are about to drop the column `weeklyOffDays` on the `Attendance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Attendance" DROP COLUMN "weeklyOffDays";

-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "weeklyOffDays" TEXT[];
