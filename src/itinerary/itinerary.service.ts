import { Injectable, NotFoundException } from "@nestjs/common";
import { DETAILS_TYPE, Itinerary, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateDetailsDto } from "./dto/create-details.dto";
import { CreateItineraryDto } from "./dto/create-itinerary.dto";

@Injectable()
export class ItinerariesService {
  constructor(private prisma: PrismaService) {}

  async getAllOrdered(): Promise<Itinerary[]> {
    return this.prisma.itinerary.findMany({
      orderBy: [
        {
          date: "desc",
        },
      ],
    });
  }

  async getId(where: Prisma.ItineraryWhereUniqueInput): Promise<Itinerary> {
    const itinerary = await this.prisma.itinerary.findUnique({
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

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${where.id} not found`);
    }

    return itinerary;
  }

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
        date: new Date(),
        user: { connect: { id: userId } },
      },
    });

    return await this.prisma.itinerary.findMany({
      where: { userId: userId },
      orderBy: { date: "desc" },
    });
  }

  async createDetails(itineraryId: number, data: CreateDetailsDto) {
    const itinerary = await this.prisma.itinerary.findUnique({
      where: { id: itineraryId },
    });

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${itineraryId} not found`);
    }

    const { type, startDate, endDate, ...rest } = data;

    await this.prisma.details.create({
      data: {
        ...rest,
        type: (type as DETAILS_TYPE) || DETAILS_TYPE.FLIGHT,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        itinerary: { connect: { id: itineraryId } },
      },
    });

    return await this.prisma.details.findMany({
      where: { itineraryId: itineraryId },
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    });
  }

  async updateDetails(detailsId: number, data: CreateDetailsDto) {
    const details = await this.prisma.details.findUnique({
      where: { id: detailsId },
    });

    if (!details) {
      throw new NotFoundException(`Details with ID ${detailsId} not found`);
    }

    const { type, startDate, endDate, ...rest } = data;

    await this.prisma.details.update({
      where: { id: detailsId },
      data: {
        ...rest,
        type: type ? (type as DETAILS_TYPE) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return this.prisma.details.findMany({
      where: { itineraryId: details.itineraryId },
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    });
  }

  async deleteDetails(detailsId: number) {
    const details = await this.prisma.details.findUnique({
      where: { id: detailsId },
    });

    if (!details) {
      throw new NotFoundException(`Details with ID ${detailsId} not found`);
    }

    await this.prisma.details.delete({
      where: { id: detailsId },
    });

    return this.prisma.details.findMany({
      where: { itineraryId: details.itineraryId },
      orderBy: [
        {
          startDate: "desc",
        },
      ],
    });
  }
}
