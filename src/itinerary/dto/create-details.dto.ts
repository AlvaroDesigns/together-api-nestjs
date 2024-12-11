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
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsInt()
  @IsNotEmpty()
  days: number;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @IsOptional()
  @IsString()
  departure?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsInt()
  stars?: number;

  @IsOptional()
  @IsString()
  placeUrl?: string;

  @IsOptional()
  @IsString()
  numberFlight?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  description?: string[];

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  cityName?: string;

  @IsOptional()
  @IsString()
  region?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  collapse?: boolean;
}
