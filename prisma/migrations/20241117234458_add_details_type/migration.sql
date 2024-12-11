/*
  Warnings:

  - The `type` column on the `Details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DetailsType" AS ENUM ('FLIGHT', 'TRANSFER', 'REN_CAR', 'BOAT', 'HOTEL', 'TRIP');

-- AlterTable
ALTER TABLE "Details" DROP COLUMN "type",
ADD COLUMN     "type" "DetailsType" NOT NULL DEFAULT 'FLIGHT';
