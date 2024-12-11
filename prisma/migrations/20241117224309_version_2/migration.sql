/*
  Warnings:

  - You are about to drop the column `authorId` on the `Itinerary` table. All the data in the column will be lost.
  - You are about to drop the `Items` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ItemsToItinerary` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `date` to the `Itinerary` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Itinerary` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_authorId_fkey";

-- DropForeignKey
ALTER TABLE "_ItemsToItinerary" DROP CONSTRAINT "_ItemsToItinerary_A_fkey";

-- DropForeignKey
ALTER TABLE "_ItemsToItinerary" DROP CONSTRAINT "_ItemsToItinerary_B_fkey";

-- AlterTable
ALTER TABLE "Itinerary" DROP COLUMN "authorId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Items";

-- DropTable
DROP TABLE "_ItemsToItinerary";

-- CreateTable
CREATE TABLE "Details" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'flight',
    "title" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "departure" TEXT,
    "destination" TEXT,
    "numberFlight" TEXT,
    "description" TEXT[],
    "itineraryId" INTEGER NOT NULL,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
