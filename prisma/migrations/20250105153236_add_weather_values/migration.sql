-- AlterEnum
ALTER TYPE "DetailsType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Itinerary" ADD COLUMN     "humidity" TEXT,
ADD COLUMN     "temperatureMax" TEXT,
ADD COLUMN     "temperatureMin" TEXT;
