import { CACHE_MANAGER } from "@nestjs/cache-manager";
import {
  Inject,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Cache } from "cache-manager";
import { Browser, chromium, Page } from "playwright";

@Injectable()
export class ScrapingService {
  private readonly logger = new Logger(ScrapingService.name);
  private browser: Browser | null = null;

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  // Iniciar Playwright al inicializar el módulo
  async init() {
    try {
      this.browser = await chromium.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
        ],
      });
      this.logger.log("Playwright Chromium initialized successfully.");
    } catch (error) {
      this.browser = null;
      this.logger.warn(
        `Playwright Chromium could not be launched at startup: ${error.message}`
      );
    }
  }

  // Método para scrapear detalles de un vuelo
  async scrapeFlight(flightNumber: string): Promise<any> {
    const cachedData = await this.cacheManager.get(flightNumber);

    if (cachedData) {
      this.logger.log(`Cache hit for flight ${flightNumber}`);
      return cachedData;
    }

    if (!this.browser || !this.browser.isConnected()) {
      await this.init();
    }

    if (!this.browser) {
      throw new ServiceUnavailableException(
        "El servicio de scraping de vuelos no está disponible en este momento."
      );
    }

    let page: Page | null = null;

    try {
      page = await this.browser.newPage();

      const url = `https://www.airnavradar.com/data/flights/${encodeURIComponent(flightNumber)}`;
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 20000 });

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

        const citys = Array.from(
          document.querySelectorAll("#airports #city")
        ).map((item) => item.innerHTML.trim());

        const arrivalTime = Array.from(
          document.querySelectorAll("#content #value")
        ).map((item) => item.textContent?.trim());

        return {
          departure:
            citys[0] || (document.querySelector("body") as any)?.innerText,
          arrivadas: citys[1] || null,
          departureLabel: citysLarge[2] || null,
          arrivadasLabel: citysLarge[3] || null,
          arrivalTime: arrivalTime[1] || null,
        };
      });

      await this.cacheManager.set(flightNumber, flightInfo, 1000);

      return flightInfo;
    } catch (error) {
      this.logger.error(
        `Error al obtener los datos del vuelo ${flightNumber}: ${error.message}`
      );
      throw new ServiceUnavailableException("Error al obtener los datos del vuelo.");
    } finally {
      if (page) {
        try {
          await page.close();
        } catch (e) {}
      }
    }
  }

  // Cerrar el navegador cuando se detenga el servicio
  async close() {
    if (this.browser) {
      try {
        await this.browser.close();
      } catch (e) {}
      this.browser = null;
    }
  }
}
