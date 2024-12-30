/*
  Warnings:

  - The primary key for the `Details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `title` on the `Details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Details" DROP CONSTRAINT "Details_pkey",
DROP COLUMN "title",
ALTER COLUMN "endDate" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ALTER COLUMN "description" SET DATA TYPE TEXT,
ADD CONSTRAINT "Details_pkey" PRIMARY KEY ("id", "itineraryId");
