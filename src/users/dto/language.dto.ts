import { ApiProperty } from "@nestjs/swagger";
import { LANGUAGE_TYPE } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateLanguageDto {
  @ApiProperty({
    description: "Language of the user",
    example: "EN",
  })
  @IsEnum(LANGUAGE_TYPE)
  language: LANGUAGE_TYPE;
}
