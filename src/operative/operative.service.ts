import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from "@nestjs/common";
import axios from "axios";
import { isObject, isString } from "class-validator";
import { SendEmailDto } from "./dto/email.dto";

interface DestinationResponse {
  id: string;
  nombre: string;
  id_destino: string;
  id_pais: string;
  pais: string;
}

@Injectable()
export class OperativeService {
  private readonly logger = new Logger(OperativeService.name);

  async searchDestination(query: string): Promise<any> {
    if (!query || !isString(query)) {
      throw new BadRequestException(`Invalid query format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://wanderlog.com/api/geo/autocomplete/${encodeURIComponent(query.trim())}`,
    };

    try {
      const response = await axios.request(options);

      const destination = response?.data?.data?.map((destination: any) => ({
        key: destination?.name,
        name: destination?.name,
        stateName: destination?.stateName,
        countryName: destination?.countryName,
        subcategory: destination?.subcategory,
        latitude: destination?.latitude,
        longitude: destination?.longitude,
      }));

      return {
        data: destination || [],
        status: response?.data?.status,
      };
    } catch (error) {
      this.logger.error(`Error in searchDestination: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error fetching data from Autocomplete API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchDestinations(query: string): Promise<any> {
    if (!query || !isString(query)) {
      throw new BadRequestException(`Invalid query format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://www.atrapalo.com/vuelos/home_buscador_ajax/origen/${encodeURIComponent(query.trim())}`,
    };

    try {
      const response = await axios.request(options);

      const destination = response?.data?.data?.map(
        (destination: DestinationResponse) => ({
          key: destination?.id,
          name: destination?.nombre,
          id: destination?.id_destino,
          id_country: destination?.id_pais,
          country: destination?.pais,
        })
      );

      return {
        data: destination || [],
        status: response?.data?.status,
      };
    } catch (error) {
      this.logger.error(`Error in searchDestinations: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error fetching data from Flights API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchWeather(query: string): Promise<any> {
    if (!query || !isString(query)) {
      throw new BadRequestException(`Invalid query weather format: ${query}`);
    }

    const API_KEY = process.env.WEATHER_API_KEY;
    const name = encodeURIComponent(query.trim().split(" ").join("_"));

    const options = {
      method: "GET",
      url: `https://api.tomorrow.io/v4/timelines?location=${name}&fields=temperatureMax,temperatureMin,humidityAvg&units=metric&timesteps=1d&apikey=${API_KEY}`,
    };

    try {
      const response = await axios.request(options);
      return response?.data?.data?.timelines?.[0];
    } catch (error) {
      this.logger.error(`Error in searchWeather: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error fetching data from Weather API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchFight(flightNumber: string, date: string): Promise<any> {
    if (!flightNumber || !isString(flightNumber)) {
      throw new BadRequestException(
        `Invalid flight number format: ${flightNumber}`
      );
    }

    const trimmed = flightNumber.trim();
    const prefix = trimmed.slice(0, 2);
    const rest = trimmed.slice(2);

    const options = {
      method: "GET",
      url: `https://wanderlog.com/api/flights/flightStops?airlineIata=${encodeURIComponent(prefix)}&flightNumber=${encodeURIComponent(rest)}&departDate=${encodeURIComponent(date)}`,
    };

    try {
      const response = await axios.request(options);
      const details = response.data?.data?.[0];

      if (!details) {
        return null;
      }

      return {
        arrive: {
          cityName: details?.arrive?.airport?.cityName,
          name: details?.arrive?.airport?.name,
          iata: details?.arrive?.airport?.iata,
          date: details?.arrive?.date,
          time: details?.arrive?.time,
        },
        depart: {
          cityName: details?.depart?.airport?.cityName,
          name: details?.depart?.airport?.name,
          iata: details?.depart?.airport?.iata,
          date: details?.depart?.date,
          time: details?.depart?.time,
        },
      };
    } catch (error) {
      this.logger.error(`Error in searchFlight: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error fetching flight data",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendEmail(body: SendEmailDto): Promise<any> {
    if (!isObject(body)) {
      throw new BadRequestException(`Invalid body: ${body}`);
    }

    const data = {
      from: body?.from,
      to: body?.to,
      subject: body?.subject,
      html: body?.html,
    };

    try {
      const response = await axios.post("https://api.resend.com/emails", data, {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      this.logger.error(`Error in sendEmail: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error sending email via Email API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchImageDestination(query: string): Promise<any> {
    if (!query || !isString(query)) {
      throw new BadRequestException(`Invalid query image format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://api.pexels.com/v1/search?query=${encodeURIComponent(query.trim())}&per_page=1&page=1`,
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);

      return {
        src: response?.data?.photos?.[0]?.src?.large2x || null,
      };
    } catch (error) {
      this.logger.error(`Error in searchImageDestination: ${error.message}`);
      throw new HttpException(
        error.response?.data || "Error fetching image from Pexels API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
