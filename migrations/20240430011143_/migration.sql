/*
  Warnings:

  - Changed the type of `reviewerId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `revieweeId` on the `Review` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_revieweeId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_reviewerId_fkey";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "reviewerId",
ADD COLUMN     "reviewerId" INTEGER NOT NULL,
DROP COLUMN "revieweeId",
ADD COLUMN     "revieweeId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
