/*
  Warnings:

  - The primary key for the `Interview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Interview` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_interviewId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_pkey",
DROP COLUMN "id",
ADD COLUMN     "sessionId" TEXT NOT NULL DEFAULT '',
ADD CONSTRAINT "Interview_pkey" PRIMARY KEY ("sessionId");

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "interviewId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("sessionId") ON DELETE RESTRICT ON UPDATE CASCADE;
