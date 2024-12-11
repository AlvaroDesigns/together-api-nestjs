import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOnlyUsers() {
    return this.prisma.user.findMany();
  }

  async getUsers() {
    return this.prisma.user.findMany({
      include: {
        itinerary: {
          include: {
            items: true,
          },
        },
      },
    });
  }

  async getUserById(email: User["email"]) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { itinerary: true },
    });
  }

  async findOne(id: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: number, data: any): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
