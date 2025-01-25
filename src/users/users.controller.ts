import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("v1")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Deprecated" })
  @UseGuards(JwtAuthGuard)
  @Get("user/all")
  findOnlyAll() {
    return this.usersService.getOnlyUsers();
  }

  @ApiOperation({ summary: "Get user Single" })
  @UseGuards(JwtAuthGuard)
  @Get("user/:email")
  findOneSingle(@Param("email") email: string) {
    return this.usersService.findOneSingle(email);
  }

  @ApiOperation({ summary: "Get user" })
  @UseGuards(JwtAuthGuard)
  @Get("user/:email")
  findOne(@Param("email") email: string) {
    return this.usersService.findOne(email);
  }

  @ApiOperation({ summary: "Create user" })
  @UseGuards(JwtAuthGuard)
  @Post("user")
  createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @ApiOperation({ summary: "Editar user" })
  @UseGuards(JwtAuthGuard)
  @Patch("user/:id")
  updateUser(@Param("id") id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(+id, data);
  }

  @ApiOperation({ summary: "Update a user" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @Put(":id")
  //   @ApiBody({ type: UpdateUserDto })
  async updatePutUser(@Param("id") id: number, @Body() data: UpdateUserDto) {
    return this.usersService.updatePutUser(id, data);
  }

  @ApiOperation({ summary: "Delete user" })
  @UseGuards(JwtAuthGuard)
  @Delete("user/:id")
  removeUser(@Param("id") id: string) {
    return this.usersService.deleteUser(+id);
  }
}
