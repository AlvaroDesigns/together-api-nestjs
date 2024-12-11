import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ItineraryModule } from "./itinerary/itinerary.module";
import { PrismaModule } from "./prisma/prisma.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [AuthModule, UsersModule, ItineraryModule, PrismaModule],
})
export class AppModule {}
