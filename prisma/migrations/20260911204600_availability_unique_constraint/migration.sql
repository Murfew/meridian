/*
  Warnings:

  - A unique constraint covering the columns `[ownerId,dayOfWeek]` on the table `availability` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "availability_ownerId_dayOfWeek_idx";

-- CreateIndex
CREATE UNIQUE INDEX "availability_ownerId_dayOfWeek_key" ON "availability"("ownerId", "dayOfWeek");
