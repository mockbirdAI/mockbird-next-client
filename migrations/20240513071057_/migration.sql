-- CreateTable
CREATE TABLE "Withdraws" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Withdraws_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Withdraws" ADD CONSTRAINT "Withdraws_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
