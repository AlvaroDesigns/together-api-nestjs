/*
  Warnings:

  - You are about to drop the column `humidity` on the `Itinerary` table. All the data in the column will be lost.
  - You are about to drop the column `temperatureMax` on the `Itinerary` table. All the data in the column will be lost.
  - You are about to drop the column `temperatureMin` on the `Itinerary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "humidity",
DROP COLUMN "temperatureMax",
DROP COLUMN "temperatureMin";
