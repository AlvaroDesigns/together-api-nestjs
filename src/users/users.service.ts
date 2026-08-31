import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { isEmail } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateLanguageDto } from "./dto/language.dto";
import { UpdatePasswordDto } from "./dto/password.dto";
import { UpdateUserDetailsDto } from "./dto/profile-edit.dto";
import { UpdateUserDto } from "./dto/update-user";

export const USER_SELECT = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  language: true,
  role: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getOnlyUsers() {
    return this.prisma.user.findMany({
      select: USER_SELECT,
    });
  }

  async getUserById(email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
      select: {
        ...USER_SELECT,
        itinerary: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async findOne(email: string) {
    if (!isEmail(email)) {
      throw new BadRequestException(`Invalid email format: ${email}`);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        ...USER_SELECT,
        itinerary: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async createUser(data: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new ConflictException("El usuario con este correo ya existe");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      select: USER_SELECT,
    });
  }

  async updateUser(id: number, data: any) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    const updateData: any = { ...data };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      select: USER_SELECT,
    });
  }

  async updatePutUser(id: number, data: UpdateUserDto) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  async deleteUser(id: number) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.delete({
      where: { id },
      select: USER_SELECT,
    });
  }

  async updateLanguage(id: number, data: UpdateLanguageDto) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        language: data.language,
      },
      select: USER_SELECT,
    });
  }

  async updatePassword(id: number, data: UpdatePasswordDto) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
      select: USER_SELECT,
    });
  }

  async updateUserDetails(id: number, data: UpdateUserDetailsDto) {
    if (!Number.isInteger(id)) {
      throw new BadRequestException(`Invalid user ID format: ${id}`);
    }

    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }
}
