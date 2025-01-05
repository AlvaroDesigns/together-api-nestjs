import { Module } from "@nestjs/common";

import { CacheModule } from "@nestjs/cache-manager";
import { OperativeController } from "./operative.contoller";
import { OperativeService } from "./operative.service";

@Module({
  imports: [CacheModule.register()],
  controllers: [OperativeController],
  providers: [OperativeService],
})
export class OperativeModule {}
