/*
  Warnings:

  - The primary key for the `Details` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Details" DROP CONSTRAINT "Details_pkey",
ADD CONSTRAINT "Details_pkey" PRIMARY KEY ("id");
