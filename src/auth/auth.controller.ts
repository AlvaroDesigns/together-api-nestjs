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

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register" })
  @Post("register")
  async register(
    @Body() body: { email: string; password: string; name: string }
  ) {
    return this.authService.register(body.email, body.password, body.name);
  }

  @ApiOperation({ summary: "User login" })
  @ApiBody({ type: LoginDto })
  @Post("login")
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }
}
