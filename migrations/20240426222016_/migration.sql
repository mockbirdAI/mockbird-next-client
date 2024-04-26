-- DropIndex
DROP INDEX "InterviewRequest_paymentId_key";

-- AlterTable
ALTER TABLE "InterviewRequest" ALTER COLUMN "paymentId" DROP NOT NULL;
