import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiOperation } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register" })
  @ApiBody({ type: RegisterDto })
  @Post("register")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: LoginDto })
  @Post("login")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: "refresh token" })
  @ApiBody({
    schema: { type: "object", properties: { token: { type: "string" } } },
  })
  @Post("refresh")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async refreshToken(@Body("token") token: string) {
    return this.authService.refreshToken(token);
  }
}
