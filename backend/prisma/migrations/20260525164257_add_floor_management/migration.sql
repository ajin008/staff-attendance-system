/*
  Warnings:

  - You are about to drop the column `floorName` on the `StaffAllocation` table. All the data in the column will be lost.
  - Added the required column `floorId` to the `StaffAllocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StaffAllocation" DROP COLUMN "floorName",
ADD COLUMN     "floorId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Floor" (
    "id" SERIAL NOT NULL,
    "organizationId" INTEGER NOT NULL,
    "branchId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT,
    "maxCapacity" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Floor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StaffAllocation" ADD CONSTRAINT "StaffAllocation_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Floor" ADD CONSTRAINT "Floor_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
