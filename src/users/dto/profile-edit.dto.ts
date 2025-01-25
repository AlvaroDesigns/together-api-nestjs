import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString } from "class-validator";

export class UpdateUserDetailsDto {
  @ApiProperty({
    description: "Name of the user",
    example: "John Doe",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: "Email of the user",
    example: "john.doe@example.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: "Phone number of the user",
    example: "+1234567890",
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
