import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @ApiProperty({
    description: "Email address of the recipient",
    example: "example@example.com",
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Password address",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
