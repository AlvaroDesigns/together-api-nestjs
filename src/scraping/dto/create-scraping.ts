import { IsNotEmpty, IsString } from "class-validator";

export class FlightQueryDto {
  @IsNotEmpty()
  @IsString()
  flightNumber: string;
}
