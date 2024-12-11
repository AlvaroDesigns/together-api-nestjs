import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ItinerariesController } from "./itinerary.controller";
import { ItinerariesService } from "./itinerary.service";

@Module({
  controllers: [ItinerariesController],
  providers: [ItinerariesService, PrismaService],
})
export class ItineraryModule {}
