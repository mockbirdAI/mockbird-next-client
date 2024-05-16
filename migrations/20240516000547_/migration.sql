/*
  Warnings:

  - Added the required column `name` to the `SupportTicket` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SupportTicket" ADD COLUMN     "name" TEXT NOT NULL;
