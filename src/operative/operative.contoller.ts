import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { SendEmailDto } from "./dto/email.dto";
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

  @ApiOperation({ summary: "Get Directions search" })
  @UseGuards(JwtAuthGuard)
  @Get("directions")
  searrcherDirections(@Query("query") query: string) {
    return this.operativeService.searchDestinations(query);
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

  @ApiOperation({ summary: "Send an email" })
  @Post("email")
  @ApiBody({ type: SendEmailDto })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async sendEmail(@Body() sendEmail: SendEmailDto) {
    return this.operativeService.sendEmail(sendEmail);
  }

  @ApiOperation({ summary: "Get image" })
  @UseGuards(JwtAuthGuard)
  @Get("image")
  getDestination(@Query("query") query: string) {
    return this.operativeService.searchImageDestination(query);
  }
}
