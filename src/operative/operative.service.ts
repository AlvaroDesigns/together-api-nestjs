import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from "@nestjs/common";
import axios from "axios";
import { isString } from "class-validator";

@Injectable()
export class OperativeService {
  async searchDestination(query: string): Promise<any> {
    if (!isString(query)) {
      throw new BadRequestException(`Invalid query format: ${query}`);
    }

    const options = {
      method: "GET",
      url: `https://autocomplete.toolfactory.tech/query?q=${query}&l=es&f=json&g=false&n=10&t=ISL,ZON,CIU,HOT&o=HOT`,
    };

    try {
      const response = await axios.request(options);

      const destination = response.data?.d.map((destination) => ({
        label: destination.text,
        key: destination.text,
        value: destination.value,
      }));

      return destination;
    } catch (error) {
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
}
