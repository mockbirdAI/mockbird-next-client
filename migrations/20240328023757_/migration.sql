/*
  Warnings:

  - A unique constraint covering the columns `[meetingId]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Interview" ADD COLUMN     "hostToken" TEXT,
ADD COLUMN     "meetingId" TEXT,
ADD COLUMN     "userToken" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Interview_meetingId_key" ON "Interview"("meetingId");
