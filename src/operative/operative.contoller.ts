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
  @Get("directions")
  search(@Query("query") query: string) {
    return this.operativeService.searchDestination(query);
  }

  @ApiOperation({ summary: "Get Wather details" })
  @UseGuards(JwtAuthGuard)
  @Get("weather")
  searchWeather(@Query("query") query: string) {
    return this.operativeService.searchWeather(query);
  }

  @ApiOperation({ summary: "Get flight details" })
  @UseGuards(JwtAuthGuard)
  @Get("fight")
  searchFights(
    @Query("flightNumber") flightNumber: string,
    @Query("date") date: string
  ) {
    return this.operativeService.searchFight(flightNumber, date);
  }
}
