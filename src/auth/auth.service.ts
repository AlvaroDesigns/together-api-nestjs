import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  // Registro de usuario
  async register(body: RegisterDto) {
    const { email, password, name, phone } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException("El usuario con este correo ya existe");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: { email, password: hashedPassword, name, phone },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  // Inicio de sesión
  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    const isPasswordValid = await bcrypt.compare(
      String(password),
      String(user.password)
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciales incorrectas");
    }

    return {
      ...this.createToken(user),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        language: user.language,
        avatar: user.avatar,
      },
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException("Refresh token inválido o expirado");
      }

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      // Generar un nuevo token de acceso
      return {
        ...this.createToken(user),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          language: user.language,
          avatar: user.avatar,
        },
      };
    } catch (error) {
      throw new UnauthorizedException("Refresh token inválido o expirado");
    }
  }

  // Generar token JWT
  private createToken(user: { id: number; email: string; name: string }) {
    const payload = { sub: user.id, email: user.email, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
