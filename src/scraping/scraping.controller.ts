import {
  BadRequestException,
  Controller,
  Get,
  OnModuleDestroy,
  OnModuleInit,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiTags } from "@nestjs/swagger";
import { ScrapingService } from "./scraping.service";

@ApiTags("Operative")
@Controller("v1/operative")
export class ScrapingController implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly scrapingService: ScrapingService) {}

  // Iniciar el navegador cuando se carga el módulo
  async onModuleInit() {
    try {
      await this.scrapingService.init();
    } catch (e) {}
  }

  // Cerrar el navegador cuando se destruye el módulo
  async onModuleDestroy() {
    try {
      await this.scrapingService.close();
    } catch (e) {}
  }

  // Endpoint para obtener detalles de un vuelo
  @ApiOperation({ summary: "Get Flight search" })
  @ApiQuery({ name: "flightNumber", required: true, type: String })
  @Get("/flight")
  async getFlight(@Query("flightNumber") flightNumber: string) {
    if (!flightNumber || typeof flightNumber !== "string") {
      throw new BadRequestException("Por favor, proporciona un número de vuelo válido");
    }

    return this.scrapingService.scrapeFlight(flightNumber.trim());
  }
}
