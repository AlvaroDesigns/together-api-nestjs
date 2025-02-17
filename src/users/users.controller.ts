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
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateLanguageDto } from "./dto/language.dto";
import { UpdatePasswordDto } from "./dto/password.dto";
import { UpdateUserDetailsDto } from "./dto/profile-edit.dto";
import { UpdateUserDto } from "./dto/update-user";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("v1/user")
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: "Deprecated" })
  @UseGuards(JwtAuthGuard)
  @Get("all")
  findOnlyAll() {
    return this.usersService.getOnlyUsers();
  }

  @ApiOperation({ summary: "Get user" })
  @UseGuards(JwtAuthGuard)
  @Get(":email")
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
  @Patch(":id")
  updateUser(@Param("id") id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateUser(+id, data);
  }

  @ApiOperation({ summary: "Update a user" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @ApiBody({ type: UpdateUserDto })
  @Put(":id")
  async updatePutUser(@Param("id") id: number, @Body() data: UpdateUserDto) {
    return this.usersService.updatePutUser(id, data);
  }

  @ApiOperation({ summary: "Delete user" })
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @Delete(":id")
  removeUser(@Param("id") id: string) {
    return this.usersService.deleteUser(+id);
  }

  @ApiOperation({ summary: "Update user language" })
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateLanguageDto })
  @Patch(":id/language")
  async updateLanguage(
    @Param("id") id: number,
    @Body() data: UpdateLanguageDto
  ) {
    return this.usersService.updateLanguage(id, data);
  }

  @Patch(":id/password")
  @ApiOperation({ summary: "Update user password" })
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdatePasswordDto })
  async updatePassword(
    @Param("id") id: number,
    @Body() data: UpdatePasswordDto
  ) {
    return this.usersService.updatePassword(id, data);
  }

  @Patch(":id/account")
  @ApiOperation({ summary: "Update user account" })
  @ApiParam({ name: "id", type: Number, description: "ID of the user" })
  @UseGuards(JwtAuthGuard)
  @ApiBody({ type: UpdateUserDetailsDto })
  async updateUserDetails(
    @Param("id") id: number,
    @Body() data: UpdateUserDetailsDto
  ) {
    return this.usersService.updateUserDetails(id, data);
  }
}
