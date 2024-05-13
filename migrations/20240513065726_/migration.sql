/*
  Warnings:

  - You are about to drop the column `payoutEmail` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "payoutEmail";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "payoutEmail" TEXT;
