import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class SendEmailDto {
  @ApiProperty({
    description: "Email address of the recipient",
    example: "example@example.com",
  })
  @IsEmail()
  from: string;

  @ApiProperty({
    description: "Email address of the recipient",
    example: "example@example.com",
  })
  @IsEmail()
  to: string;

  @ApiProperty({
    description: "Subject of the email",
    example: "Hello World",
  })
  @IsString()
  subject: string;
}
