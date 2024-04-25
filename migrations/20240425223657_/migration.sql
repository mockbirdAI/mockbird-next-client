/*
  Warnings:

  - You are about to drop the column `transactionDate` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `payeeId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payerId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentIntentId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "transactionDate",
ADD COLUMN     "payeeId" TEXT NOT NULL,
ADD COLUMN     "payerId" TEXT NOT NULL,
ADD COLUMN     "paymentIntentId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "UserFinances" (
    "userId" TEXT NOT NULL,
    "pending" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "withdrawable" DOUBLE PRECISION NOT NULL DEFAULT 0.00,

    CONSTRAINT "UserFinances_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "UserFinances" ADD CONSTRAINT "UserFinances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
