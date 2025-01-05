import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { OperativeService } from "./operative.service";

@ApiTags("Operative")
@ApiBearerAuth()
@Controller("v1/operative")
export class OperativeController {
  constructor(private operativeService: OperativeService) {}

  @ApiOperation({ summary: "Get Hotel search" })
  @UseGuards(JwtAuthGuard)
  @Get("hotels")
  search(@Query("query") query: string) {
    return this.operativeService.searchDestination(query);
  }

  @ApiOperation({ summary: "Get Wather details" })
  @UseGuards(JwtAuthGuard)
  @Get("weather")
  searchWeather(@Query("query") query: string) {
    return this.operativeService.searchWeather(query);
  }
}
