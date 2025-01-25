import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class UpdatePasswordDto {
  @ApiProperty({
    description: "New password of the user",
    example: "newPassword123",
  })
  @IsString()
  @MinLength(6)
  password: string;
}
