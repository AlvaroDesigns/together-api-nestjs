/*
  Warnings:

  - The `type` column on the `Details` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DETAILS_TYPE" AS ENUM ('FLIGHT', 'TRANSFER', 'REN_CAR', 'BOAT', 'HOTEL', 'TRIP', 'OTHER');

-- CreateEnum
CREATE TYPE "LANGUAGE_TYPE" AS ENUM ('ES', 'EN');

-- AlterTable
ALTER TABLE "Details" DROP COLUMN "type",
ADD COLUMN     "type" "DETAILS_TYPE" NOT NULL DEFAULT 'FLIGHT';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "language" "LANGUAGE_TYPE" NOT NULL DEFAULT 'ES';

-- DropEnum
DROP TYPE "DetailsType";
