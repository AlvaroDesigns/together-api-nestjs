import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class RegisterDto {
  @ApiProperty({
    description: "Name address of the recipient",
    example: "Jesus",
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "Password address",
    example: "123456",
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: "Phone number of the recipient",
    example: "661123123",
  })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: "Email address of the recipient",
    example: "example@example.com",
  })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
}
