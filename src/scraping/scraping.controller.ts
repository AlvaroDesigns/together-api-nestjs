import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  OnModuleDestroy,
  OnModuleInit,
  Query,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ScrapingService } from "./scraping.service";

@ApiTags("Operative")
@Controller("v1/operative")
export class ScrapingController implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly scrapingService: ScrapingService) {}

  // Iniciar el navegador cuando se carga el módulo
  async onModuleInit() {
    await this.scrapingService.init();
  }

  // Cerrar el navegador cuando se destruye el módulo
  async onModuleDestroy() {
    await this.scrapingService.close();
  }

  // Endpoint para obtener detalles de un vuelo
  @ApiOperation({ summary: "Get Flight search" })
  @Get("/flight")
  async getFlight(@Query("flightNumber") flightNumber: string) {
    if (!flightNumber) {
      return new HttpException(
        "Por favor, proporciona un número de vuelo",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    try {
      const result = await this.scrapingService.scrapeFlight(flightNumber);
      return result; // Devuelve los datos del vuelo en formato JSON
    } catch (error) {
      return { error: error.message };
    }
  }
}
