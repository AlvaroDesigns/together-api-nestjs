import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { isEmail, isNumber } from "class-validator";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateLanguageDto } from "./dto/language.dto";
import { UpdatePasswordDto } from "./dto/password.dto";
import { UpdateUserDetailsDto } from "./dto/profile-edit.dto";
import { UpdateUserDto } from "./dto/update-user";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOnlyUsers() {
    return this.prisma.user.findMany();
  }

  async getUserById(email: User["email"]) {
    if (!isEmail(email)) {
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    return this.prisma.user.findUnique({
      where: { email },
      include: { itinerary: true },
    });
  }

  async findOne(email: string): Promise<User> {
    // Verificar si el email es válido
    if (!isEmail(email)) {
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    return this.prisma.user.findUnique({
      where: {
        email,
      },
      include: { itinerary: true },
    });
  }

  async createUser(data: CreateUserDto): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async updateUser(id: number, data: any): Promise<User> {
    if (!isNumber(id)) {
      throw new BadRequestException(`Invalid email format: ${id}`);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async updatePutUser(id: number, data: UpdateUserDto): Promise<User> {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

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

  async updateLanguage(id: number, data: UpdateLanguageDto): Promise<User> {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        language: data.language,
      },
    });
  }

  async updatePassword(id: number, data: UpdatePasswordDto): Promise<User> {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password: data.password,
      },
    });
  }

  async updateUserDetails(
    id: number,
    data: UpdateUserDetailsDto
  ): Promise<User> {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
    });
  }
}
