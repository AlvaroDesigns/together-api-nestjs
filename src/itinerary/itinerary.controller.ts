import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { Itinerary, Prisma } from "@prisma/client";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateDetailsDto } from "./dto/create-details.dto";
import { CreateItineraryDto } from "./dto/create-itinerary.dto";
import { ItinerariesService } from "./itinerary.service";

@ApiBearerAuth()
@ApiTags("Itinerary")
@Controller("v1/itinerary")
export class ItinerariesController {
  constructor(private itineraryService: ItinerariesService) {}

  @ApiOperation({ summary: "Get itinerary" })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPublishedPosts(): Promise<Itinerary[]> {
    return this.itineraryService.getAll();
  }

  @ApiOperation({ summary: "get id itinerary, 60" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "id",
    type: String,
    description: "ID of the itinerary",
  })
  @Get(":id")
  async getId(@Param("id") id: number): Promise<Itinerary> {
    return this.itineraryService.getId({ id: Number(id) });
  }

  @ApiOperation({ summary: "Edit itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "id",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async publishItinerary(@Param("id") id: string): Promise<Itinerary> {
    return this.itineraryService.update({
      where: { id: Number(id) },
      data: { published: true } as Prisma.ItineraryUpdateInput,
    });
  }

  @ApiOperation({ summary: "Edit itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "id",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  updateItinerary(
    @Param("id") id: string,
    @Body() data: Prisma.ItineraryUpdateInput
  ) {
    return this.itineraryService.update({
      where: { id: Number(id) },
      data,
    });
  }

  @ApiOperation({ summary: "Remove itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "id",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteItinerary(@Param("id") id: string): Promise<Itinerary> {
    return this.itineraryService.delete({ id: Number(id) });
  }

  @Post(":userId")
  @ApiOperation({ summary: "Create itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "userId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createItinerary(
    @Param("userId") userId: string,
    @Body() itinerary: CreateItineraryDto
  ) {
    const numericUserId = parseInt(userId, 10);

    return this.itineraryService.create(numericUserId, itinerary);
  }

  @Post(":itineraryId/details")
  @ApiOperation({ summary: "Create details" })
  @ApiBody({ type: CreateDetailsDto })
  @ApiParam({
    name: "itineraryId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createDetails(
    @Param("itineraryId") itineraryId: number,
    @Body() createDetailsDto: CreateDetailsDto
  ) {
    return this.itineraryService.createDetails(itineraryId, createDetailsDto);
  }
}
