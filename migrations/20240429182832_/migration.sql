/*
  Warnings:

  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "services" JSONB[];

-- DropTable
DROP TABLE "Service";
