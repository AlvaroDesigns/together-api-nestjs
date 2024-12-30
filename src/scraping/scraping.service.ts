import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

import { Browser, chromium, Page } from "playwright";

@Injectable()
export class ScrapingService {
  private browser: Browser;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Iniciar Playwright al inicializar el módulo
  async init() {
    if (!chromium) {
      return;
    }

    this.browser = await chromium.launch({ headless: true });
  }

  // Método para scrapear detalles de un vuelo
  async scrapeFlight(flightNumber: string): Promise<any> {
    const cachedData = await this.cacheManager.get(flightNumber);

    if (cachedData) {
      console.log(`Cache hit for flight ${flightNumber}`);
      return cachedData;
    }

    const page: Page = await this.browser.newPage();

    const prefix = flightNumber.slice(0, 2);

    // Extraer el resto
    const rest = flightNumber.slice(2);

    // URL de ejemplo (cámbiala por el sitio que contiene la información del vuelo)
    const url = `https://www.flightstats.com/v2/flight-details/FR/8301/${prefix}/${rest}`;
    await page.goto(url, { waitUntil: "load" });

    try {
      // Extraer información del vuelo usando selectores CSS
      const flightInfo = await page.evaluate(() => {
        const citys = Array.from(
          document.querySelectorAll(".airportCodeTitle")
        ).map((item) => item.innerHTML.trim());

        const citysLarge = Array.from(
          document.querySelectorAll(".airportNameSubtitle")
        ).map((item) => item.innerHTML.trim());

        const arrivalTime = Array.from(
          document.querySelectorAll(".flightTimeBlock .detail")
        ).map((item) => item.innerHTML.trim());
        console.log(citys, citysLarge, arrivalTime);
        return {
          departure: citys[0] || "No disponible",
          arrivadas: citys[1] || "No disponible",
          departureLabel: citysLarge[0] || "No disponible",
          arrivadasLabel: citysLarge[1] || "No disponible",
          arrivalTime: arrivalTime[0] || "No disponible",
        };
      });

      await page.close();

      await this.cacheManager.set(flightNumber, flightInfo, 1000);

      return flightInfo;
    } catch (error) {
      await page.close();
      throw new Error("Error al obtener los datos del vuelo.");
    }
  }

  // Cerrar el navegador cuando se detenga el servicio
  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
