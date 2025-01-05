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

    // URL de ejemplo (cámbiala por el sitio que contiene la información del vuelo)
    const url = `https://www.airnavradar.com/data/flights/${flightNumber}`;
    await page.goto(url, { waitUntil: "load" });

    try {
      // Extraer información del vuelo usando selectores CSS
      const flightInfo = await page.evaluate(() => {
        const citysLarge = Array.from(
          document.querySelectorAll("#label #code")
        ).map(
          (item) =>
            item.innerHTML
              .trim()
              .replace(/[\(\)<!-- -->]/g, "")
              .trim()
              .split("/")[0]
        );
        console.log(citysLarge);
        const citys = Array.from(
          document.querySelectorAll("#airports #city")
        ).map((item) => item.innerHTML.trim());

        const arrivalTime = Array.from(
          document.querySelectorAll("#content #value")
        ).map((item) => item.textContent.trim());

        return {
          departure: citys[0] || document.querySelector("body").innerText,
          arrivadas: citys[1] || null,
          departureLabel: citysLarge[2] || null,
          arrivadasLabel: citysLarge[3] || null,
          arrivalTime: arrivalTime[1] || null,
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
