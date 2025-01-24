import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import axios from "axios";
import { isObject, isString } from "class-validator";
import { SendEmailDto } from "./dto/email.dto";

@Injectable()
export class OperativeService {
  async searchDestination(query: string): Promise<any> {
    if (!isString(query)) {
      throw new BadRequestException(`Invalid query format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://wanderlog.com/api/geo/autocomplete/{${query}}`,
    };

    try {
      const response = await axios.request(options);

      const destination = response?.data?.data?.map((destination) => ({
        key: destination?.name,
        name: destination?.name,
        stateName: destination?.stateName,
        countryName: destination?.countryName,
        subcategory: destination?.subcategory,
        latitude: destination?.latitude,
        longitude: destination?.longitude,
      }));

      return {
        data: destination,
        status: response?.data.status,
      };
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data || "Error fetching data from Booking API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchWeather(query: string): Promise<any> {
    if (!isString(query)) {
      throw new BadRequestException(`Invalid query weather format: ${query}`);
    }

    const API_KEY = process.env.APIKEY_WEATHER;

    const name = query.split(" ").join("_");

    const options = {
      method: "GET",
      url: `https://api.tomorrow.io/v4/timelines?location=${name}&fields=temperatureMax,temperatureMin,humidityAvg&units=metric&timesteps=1d&apikey=${API_KEY}`,
    };

    try {
      const response = await axios.request(options);

      return response?.data.data?.timelines[0];
    } catch (error) {
      throw new HttpException(
        error.response?.data || "Error fetching data from Weather API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchFight(flightNumber: string, date: string): Promise<any> {
    if (!isString(flightNumber)) {
      throw new BadRequestException(
        `Invalid query weather format: ${flightNumber}`
      );
    }

    const prefix = flightNumber.slice(0, 2);

    // Extraer el resto
    const rest = flightNumber.slice(2);

    const options = {
      method: "GET",
      url: `https://wanderlog.com/api/flights/flightStops?airlineIata=${prefix}&flightNumber=${rest}&departDate=${date}`,
    };

    try {
      const response = await axios.request(options);

      const details = response.data.data[0];

      const mappedDetails = {
        arrive: {
          cityName: details?.arrive?.airport.cityName,
          name: details?.arrive?.airport.name,
          iata: details?.arrive?.airport.iata,
          date: details?.arrive?.date,
          time: details?.arrive?.time,
        },
        depart: {
          cityName: details?.depart?.airport.cityName,
          name: details?.depart?.airport.name,
          iata: details?.depart?.airport.iata,
          date: details?.depart?.date,
          time: details?.depart?.time,
        },
      };

      return mappedDetails;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        error.response?.data || "Error fetching data from Weather API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async sendEmail(body: SendEmailDto): Promise<any> {
    if (!isObject(body)) {
      throw new BadRequestException(`Invalid body response: ${body}`);
    }

    const data = {
      from: body?.from,
      to: body?.to,
      subject: body?.subject,
      html: body?.html,
    };

    const response = await axios.post("https://api.resend.com/emails", data, {
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    try {
      axios.request(response);
      return response.data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || "Error fetching data from Email API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async searchImageDestination(query: string): Promise<any> {
    if (!isString(query)) {
      throw new BadRequestException(`Invalid query image format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://api.pexels.com/v1/search?query=mallorca&per_page=1&page=1`,
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response);
      return response?.data.photos[0]?.src.large2x;
    } catch (error) {
      throw new HttpException(
        error.response?.data || "Error fetching data from Weather API",
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
