import {
  Controller,
  Get,
  OnModuleDestroy,
  OnModuleInit,
  Query,
} from "@nestjs/common";
import { ScrapingService } from "./scraping.service";

@Controller("flights")
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
  @Get()
  async getFlightDetails(@Query("flightNumber") flightNumber: string) {
    if (!flightNumber) {
      return { error: "Por favor, proporciona un número de vuelo" };
    }

    try {
      const result = await this.scrapingService.scrapeFlight(flightNumber);
      return result; // Devuelve los datos del vuelo en formato JSON
    } catch (error) {
      return { error: error.message };
    }
  }
}
