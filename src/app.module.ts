import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ItineraryModule } from "./itinerary/itinerary.module";
import { OperativeModule } from "./operative/operatives.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ScrapingModule } from "./scraping/scraping.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ItineraryModule,
    ScrapingModule,
    OperativeModule,
    // CacheModule.register({ isGlobal: true }),
    CacheModule.register({
      ttl: 300, // Tiempo de vida del caché en segundos (5 minutos)
      max: 100, // Número máximo de elementos en caché
    }),
    PrismaModule,
  ],
})
export class AppModule {}
