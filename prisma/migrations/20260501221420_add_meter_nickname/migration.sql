/*
  Warnings:

  - A unique constraint covering the columns `[meterNumber]` on the table `Meter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Meter" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "nickname" TEXT;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- CreateIndex
CREATE UNIQUE INDEX "Meter_meterNumber_key" ON "Meter"("meterNumber");
