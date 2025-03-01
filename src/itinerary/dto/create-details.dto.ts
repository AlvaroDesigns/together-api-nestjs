import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateDetailsDto {
  @ApiProperty({ description: "Tipo de detalle" })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: "Número de días", required: false })
  @IsInt()
  @IsNotEmpty()
  @IsOptional()
  days?: number;

  @ApiProperty({ description: "Fecha de inicio" })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: "Fecha de fin", required: false })
  @IsOptional()
  @IsDateString()
  @IsNotEmpty()
  endDate?: string;

  @ApiProperty({ description: "Lugar de salida", required: false })
  @IsOptional()
  @IsString()
  departure?: string;

  @ApiProperty({ description: "Etiqueta del lugar de salida", required: false })
  @IsOptional()
  @IsString()
  departureLabel?: string;

  @ApiProperty({ description: "Destino", required: false })
  @IsOptional()
  @IsString()
  destination?: string;

  @ApiProperty({ description: "Etiqueta del destino", required: false })
  @IsOptional()
  @IsString()
  destinationLabel?: string;

  @ApiProperty({ description: "Hora de llegada", required: false })
  @IsOptional()
  @IsString()
  arrivalTime?: string;

  @ApiProperty({ description: "Número de estrellas", required: false })
  @IsOptional()
  @IsInt()
  stars?: number;

  @ApiProperty({ description: "URL del lugar", required: false })
  @IsOptional()
  @IsString()
  placeUrl?: string;

  @ApiProperty({ description: "Número de vuelo", required: false })
  @IsOptional()
  @IsString()
  numberFlight?: string;

  @ApiProperty({ description: "Descripción", required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  description?: string[];

  @ApiProperty({ description: "URL de la imagen", required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ description: "Nombre de la ciudad", required: false })
  @IsOptional()
  @IsString()
  cityName?: string;

  @ApiProperty({ description: "Región", required: false })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiProperty({ description: "País", required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ description: "Nombre", required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: "Colapsar", required: false })
  @IsOptional()
  @IsBoolean()
  collapse?: boolean;
}
