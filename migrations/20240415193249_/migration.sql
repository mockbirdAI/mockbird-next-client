/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `InterviewRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "InterviewRequest" ADD COLUMN     "paymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "InterviewRequest_paymentId_key" ON "InterviewRequest"("paymentId");
