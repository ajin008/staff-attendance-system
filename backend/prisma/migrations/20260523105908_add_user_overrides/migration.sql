/*
  Warnings:

  - Made the column `staffId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "branch" TEXT,
ADD COLUMN     "departmentId" INTEGER,
ADD COLUMN     "overtimeEnabled" BOOLEAN,
ADD COLUMN     "overtimeGraceMins" INTEGER,
ADD COLUMN     "overtimeHourlyRate" DOUBLE PRECISION,
ADD COLUMN     "salary" DOUBLE PRECISION,
ADD COLUMN     "shiftEnd" TEXT,
ADD COLUMN     "shiftStart" TEXT,
ALTER COLUMN "staffId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Department" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "shiftStart" TEXT NOT NULL,
    "shiftEnd" TEXT NOT NULL,
    "overtimeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "overtimeGraceMins" INTEGER NOT NULL DEFAULT 15,
    "overtimeHourlyRate" DOUBLE PRECISION,
    "defaultSalary" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
