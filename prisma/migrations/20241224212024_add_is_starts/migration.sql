-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "cityName" TEXT,
ADD COLUMN     "collapse" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "name" TEXT,
ADD COLUMN     "placeUrl" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "stars" INTEGER;
