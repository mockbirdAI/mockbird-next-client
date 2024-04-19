/*
  Warnings:

  - The primary key for the `Interview` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `sessionId` on the `Interview` table. All the data in the column will be lost.
  - The required column `id` was added to the `Interview` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_interviewId_fkey";

-- AlterTable
ALTER TABLE "Interview" DROP CONSTRAINT "Interview_pkey",
DROP COLUMN "sessionId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Interview_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_interviewId_fkey" FOREIGN KEY ("interviewId") REFERENCES "Interview"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
