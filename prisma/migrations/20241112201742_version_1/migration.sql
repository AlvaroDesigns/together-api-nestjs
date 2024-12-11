/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "Itinerary" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "days" INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "authorId" INTEGER,

    CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Items" (
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
    "authorId" INTEGER,

    CONSTRAINT "Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ItemsToItinerary" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ItemsToItinerary_AB_unique" ON "_ItemsToItinerary"("A", "B");

-- CreateIndex
CREATE INDEX "_ItemsToItinerary_B_index" ON "_ItemsToItinerary"("B");

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsToItinerary" ADD CONSTRAINT "_ItemsToItinerary_A_fkey" FOREIGN KEY ("A") REFERENCES "Items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ItemsToItinerary" ADD CONSTRAINT "_ItemsToItinerary_B_fkey" FOREIGN KEY ("B") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
