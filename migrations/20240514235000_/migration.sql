-- CreateEnum
CREATE TYPE "AuthType" AS ENUM ('LOCAL', 'LINKEDIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authType" "AuthType" NOT NULL DEFAULT 'LOCAL',
ALTER COLUMN "password" DROP NOT NULL;
