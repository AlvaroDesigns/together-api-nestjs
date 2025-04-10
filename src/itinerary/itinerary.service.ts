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
      include: {
        items: {
          orderBy: [
            {
              type: "asc",
            },
            {
              startDate: "desc",
            },
          ],
        },
        budget: true,
      },
    });
  }

  @Patch()
  @ApiOperation({ summary: "Update a Itinerary" })
  async update(params: {
    where: Prisma.ItineraryWhereUniqueInput;
    data: Prisma.ItineraryUpdateInput;
  }): Promise<Itinerary[]> {
    const { data, where } = params;

    await this.prisma.itinerary.update({
      data,
      where,
    });

    return await this.prisma.itinerary.findMany({
      where: { id: where.id },
      orderBy: { date: "desc" },
    });
  }

  @Delete()
  @ApiOperation({ summary: "Delete a Itinerary" })
  async delete(where: Prisma.ItineraryWhereUniqueInput): Promise<Itinerary[]> {
    // Eliminar primero los detalles asociados al itinerario
    await this.prisma.details.deleteMany({
      where: { itineraryId: where.id },
    });

    // Luego eliminar el itinerario
    await this.prisma.itinerary.delete({
      where,
    });

    return await this.prisma.itinerary.findMany({
      where: { id: where.id },
      orderBy: { date: "desc" },
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
    await this.prisma.itinerary.create({
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

    return await this.prisma.itinerary.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" },
    });
  }

  @Post()
  @ApiOperation({ summary: "Create a Details" })
  async createDetails(itineraryId: number, data: CreateDetailsDto) {
    // Verificar si el itinerario existe
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${itineraryId} not found`);
    }

    // Crear los detalles asociados al itinerario
    await this.prisma.details.create({
      data: {
        ...data,
        type: data.type as DetailsType,
        itinerary: { connect: { id: itineraryId } },
      },
    });

    return await this.prisma.details.findMany({
      where: { itineraryId }, // Buscar por itineraryId, no por id
    });
  }

  @Patch()
  @ApiOperation({ summary: "Edit a Details" })
  async updateDetails(itineraryId: number, data: CreateDetailsDto) {
    // Verificar si los detalles existen
    const details = await this.prisma.details.findFirst({
      where: { itineraryId }, // Buscar por itineraryId, no por id
    });

    if (!details) {
      throw new NotFoundException(
        `Details with itinerary ID ${itineraryId} not found`
      );
    }

    // Actualizar los detalles asociados al itinerario
    await this.prisma.details.updateMany({
      where: { itineraryId }, // Actualizar por itineraryId
      data: {
        ...data,
        type: data.type as DetailsType,
      },
    });

    return await this.prisma.details.findMany({
      where: { itineraryId }, // Retornar los detalles por itineraryId
    });
  }
}
