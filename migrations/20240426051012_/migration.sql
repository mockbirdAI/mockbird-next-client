-- AlterTable
ALTER TABLE "User" ADD COLUMN     "availability" TIMESTAMP(3)[] DEFAULT ARRAY[]::TIMESTAMP(3)[];
