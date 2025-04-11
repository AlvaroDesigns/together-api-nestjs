import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
    return this.itineraryService.getAllOrdered();
  }

  @ApiOperation({ summary: "get id itinerary details" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "id",
    type: String,
    description: "ID of the itinerary",
  })
  @Get("details/:id")
  async getId(@Param("id", ParseIntPipe) id: number): Promise<Itinerary> {
    return this.itineraryService.getId({ id });
  }

  @ApiOperation({ summary: "Edit itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "itineraryId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @Patch(":itineraryId")
  updateItinerary(
    @Param("itineraryId") itineraryId: string,
    @Body() data: Prisma.ItineraryUpdateInput
  ) {
    return this.itineraryService.update({
      where: { id: Number(itineraryId) },
      data,
    });
  }

  @Delete(":itineraryId")
  @ApiOperation({ summary: "Remove itinerary" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({
    name: "itineraryId",
    type: String,
    description: "ID of the itinerary",
  })
  async delete(
    @Param("itineraryId") itineraryId: string
  ): Promise<Itinerary[]> {
    return this.itineraryService.delete({ id: Number(itineraryId) });
  }

  @Post(":itineraryId")
  @ApiOperation({ summary: "Create itinerary" })
  @ApiBody({ type: CreateItineraryDto })
  @ApiParam({
    name: "itineraryId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createItinerary(
    @Param("itineraryId") itineraryId: string,
    @Body() itinerary: CreateItineraryDto
  ) {
    const numericUserId = parseInt(itineraryId, 10);

    return this.itineraryService.create(numericUserId, itinerary);
  }

  @Post("details/:detailsId")
  @ApiOperation({ summary: "Create details" })
  @ApiBody({ type: CreateDetailsDto })
  @ApiParam({
    name: "detailsId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async createDetails(
    @Param("detailsId", ParseIntPipe) detailsId: number,
    @Body() createDetailsDto: CreateDetailsDto
  ) {
    return this.itineraryService.createDetails(detailsId, createDetailsDto);
  }

  @Patch("/details/:detailsId")
  @ApiOperation({ summary: "Update details" })
  @ApiBody({ type: CreateDetailsDto })
  @ApiParam({
    name: "detailsId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async updateDetails(
    @Param("detailsId", ParseIntPipe) detailsId: number,
    @Body() createDetailsDto: CreateDetailsDto
  ) {
    return this.itineraryService.updateDetails(detailsId, createDetailsDto);
  }

  @Delete("/details/:detailsId")
  @ApiOperation({ summary: "Delete details" })
  @ApiBody({ type: CreateDetailsDto })
  @ApiParam({
    name: "detailsId",
    type: String,
    description: "ID of the itinerary",
  })
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async deleteDetails(
    @Param("detailsId", ParseIntPipe) detailsId: number,
    @Body() createDetailsDto: CreateDetailsDto
  ) {
    return this.itineraryService.deleteDetails(detailsId, createDetailsDto);
  }
}
