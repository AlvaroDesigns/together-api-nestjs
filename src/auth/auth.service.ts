import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
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
    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: { email, password: hashedPassword, name, phone },
    });
  }

  // Inicio de sesión
  async login(data: LoginDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });

    const isPasswordValid = await bcrypt.compare(
      String(password),
      String(user.password)
    );

    /*
    if (!user || !isPasswordValid)
      throw new Error("La contraseña es incorrecta");
*/
    return this.createToken(user);
  }

  async refreshToken(token: string) {
    try {
      const payload = this.jwtService.verify(token);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException("Usuario no encontrado");
      }

      // Generar un nuevo token de acceso
      return this.createToken(user);
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
