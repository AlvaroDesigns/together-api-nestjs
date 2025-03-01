import { ApiProperty } from "@nestjs/swagger";
import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateItineraryDto {
  @ApiProperty({
    description: "Título del itinerario",
    example: "Vacaciones de verano",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: "Fecha del itinerario", example: "2025-06-15" })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({
    description: "Fecha de inicio del itinerario",
    example: "2025-06-15",
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({
    description: "Fecha de fin del itinerario",
    example: "2025-06-20",
  })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiProperty({
    description: "Imagen del itinerario",
    required: false,
    example: "https://example.com/imagen.jpg",
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({ description: "Número de días del itinerario", example: 5 })
  @IsInt()
  @IsNotEmpty()
  days: number;
}
