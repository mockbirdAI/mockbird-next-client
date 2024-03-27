/*
  Warnings:

  - The values [PENDING_ACCEPTANCE] on the enum `InterviewStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `companyId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the column `roleId` on the `Interview` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[requestId]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterEnum
BEGIN;
CREATE TYPE "InterviewStatus_new" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED');
ALTER TABLE "Interview" ALTER COLUMN "status" TYPE "InterviewStatus_new" USING ("status"::text::"InterviewStatus_new");
ALTER TYPE "InterviewStatus" RENAME TO "InterviewStatus_old";
ALTER TYPE "InterviewStatus_new" RENAME TO "InterviewStatus";
DROP TYPE "InterviewStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_roleId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP COLUMN "companyId",
DROP COLUMN "roleId",
ADD COLUMN     "requestId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availableTimeSlots" TIMESTAMP(3)[];

-- DropTable
DROP TABLE "Role";

-- CreateTable
CREATE TABLE "InterviewRequest" (
    "id" SERIAL NOT NULL,
    "candidateId" INTEGER NOT NULL,
    "recruiterId" INTEGER NOT NULL,
    "proposedTime" TIMESTAMP(3) NOT NULL,
    "status" "RequestStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterviewRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InterviewRequest_candidateId_idx" ON "InterviewRequest"("candidateId");

-- CreateIndex
CREATE INDEX "InterviewRequest_recruiterId_idx" ON "InterviewRequest"("recruiterId");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_requestId_key" ON "Interview"("requestId");

-- AddForeignKey
ALTER TABLE "Interview" ADD CONSTRAINT "Interview_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "InterviewRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterviewRequest" ADD CONSTRAINT "InterviewRequest_recruiterId_fkey" FOREIGN KEY ("recruiterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
