/*
  Warnings:

  - You are about to drop the column `degree` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `major` on the `School` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `School` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_schoolId_fkey";

-- AlterTable
ALTER TABLE "School" DROP COLUMN "degree",
DROP COLUMN "endDate",
DROP COLUMN "major",
DROP COLUMN "startDate";

-- CreateTable
CREATE TABLE "UserSchool" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "degree" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSchool_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSchool_userId_schoolId_key" ON "UserSchool"("userId", "schoolId");

-- AddForeignKey
ALTER TABLE "UserSchool" ADD CONSTRAINT "UserSchool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSchool" ADD CONSTRAINT "UserSchool_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Profile"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
