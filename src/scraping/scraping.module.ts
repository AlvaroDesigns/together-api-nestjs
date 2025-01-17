import { Module } from "@nestjs/common";

import { CacheModule } from "@nestjs/cache-manager";
import { ScrapingController } from "./scraping.controller";
import { ScrapingService } from "./scraping.service";

@Module({
  imports: [CacheModule.register()],
  controllers: [ScrapingController],
  providers: [ScrapingService],
})
export class ScrapingModule {}
