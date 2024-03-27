/*
  Warnings:

  - You are about to drop the column `availableTimeSlots` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InterviewRequest" ADD COLUMN     "purpose" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "availableTimeSlots";
