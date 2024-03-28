/*
  Warnings:

  - A unique constraint covering the columns `[hostToken]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userToken]` on the table `Interview` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Interview_hostToken_key" ON "Interview"("hostToken");

-- CreateIndex
CREATE UNIQUE INDEX "Interview_userToken_key" ON "Interview"("userToken");
