import {
  Delete,
  Get,
  Injectable,
  NotFoundException,
  Patch,
  Post,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { Itinerary, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateDetailsDto } from "./dto/create-details.dto";
import { CreateItineraryDto } from "./dto/create-itinerary.dto";

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: "Update only Itinerary " })
  async getAll(): Promise<Itinerary[]> {
    return this.prisma.itinerary.findMany();
  }

  @Get()
  @ApiOperation({ summary: "Update a Itinerary and details" })
  async getId(where: Prisma.ItineraryWhereUniqueInput): Promise<Itinerary> {
    return this.prisma.itinerary.findUnique({
      where: { id: where.id },
      include: { items: true, budget: true },
    });
  }

  @Patch()
  @ApiOperation({ summary: "Update a Itinerary" })
  async update(params: {
    where: Prisma.ItineraryWhereUniqueInput;
    data: Prisma.ItineraryUpdateInput;
  }): Promise<Itinerary> {
    const { data, where } = params;

    return this.prisma.itinerary.update({
      data,
      where,
    });
  }

  @Delete()
  @ApiOperation({ summary: "Delete a Itinerary" })
  async delete(where: Prisma.ItineraryWhereUniqueInput): Promise<Itinerary> {
    return this.prisma.itinerary.delete({
      where,
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a Itinerary" })
  async create(userId: number, data: CreateItineraryDto) {
    // Verificar si el usuario existe
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Crear el itinerario asociado al usuario
    return this.prisma.itinerary.create({
      data: {
        title: data.title,
        days: data.days,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        image: data.image,
        date: new Date(), // or any appropriate date value
        user: { connect: { id: userId } },
      },
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a Details" })
  async createDetails(itineraryId: number, data: CreateDetailsDto) {
    // Verificar si el itinerario existe
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: Number(itineraryId) },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${itineraryId} not found`);
    }

    // Crear el itinerario asociado al usuario
    return this.prisma.details.create({
      data: {
        ...data,
        type: data.type as DetailsType,
        itinerary: { connect: { id: Number(itineraryId) } },
      },
    });
  }

  @Patch()
  @ApiOperation({ summary: "Edit a Details" })
  async updateDetails(itineraryId: number, data: CreateDetailsDto) {
    // Verificar si los detalles existen
    const details = await this.prisma.details.findUnique({
      where: { id: Number(itineraryId) },
    });

    if (!details) {
      throw new NotFoundException(`Details with ID ${itineraryId} not found`);
    }

    // Crear el itinerario asociado al usuario
    return this.prisma.details.update({
      where: { id: Number(itineraryId) },
      data: {
        ...data,
        type: data.type as DetailsType,
      },
    });
  }
}
