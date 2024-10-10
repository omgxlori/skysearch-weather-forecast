import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// Interface for Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Class for Weather object
class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public icon: string,
    public description: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number
  ) {}
}

// WeatherService class
class WeatherService {
  private baseURL = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = process.env.OPENWEATHER_API_KEY;

  // Fetch location data using city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
      );
      if (response.data.length === 0) {
        throw new Error(`No location data found for city: ${query}`);
      }
      const locationData = response.data[0];
      return { lat: locationData.lat, lon: locationData.lon };
    } catch (error) {
      if (error instanceof Error) {
        // Handle known error types
        console.error('Error fetching location data:', (error as any).response ? (error as any).response.data : error.message);
      } else {
        // Handle unknown error types
        console.error('Unknown error fetching location data:', error);
      }
      throw new Error('Error fetching location data');
    }
  }

  // Build the query string for weather data
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=metric`;
  }

  // Fetch weather data using coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const response = await axios.get(this.buildWeatherQuery(coordinates));
      if (!response.data || response.data.cod !== "200") {
        throw new Error('Invalid weather data received from the API');
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        // Handle known error types
        console.error('Error fetching weather data:', (error as any).response ? (error as any).response.data : error.message);
      } else {
        // Handle unknown error types
        console.error('Unknown error fetching weather data:', error);
      }
      throw new Error('Error fetching weather data');
    }
  }

  // Parse current weather from response
  private parseCurrentWeather(response: any): Weather {
    const currentWeatherData = response.list[0];  // Ensure this is correctly accessing the first weather object
    if (!currentWeatherData) {
      throw new Error('No current weather data available');
    }
  
    // Ensure we extract the temperature correctly from the response data
    const temperature = currentWeatherData.main.temp;  // Extract temperature in Celsius
    const tempF = (temperature * 9/5) + 32;  // Convert to Fahrenheit if needed
  
    return new Weather(
      response.city.name,
      currentWeatherData.dt_txt,
      currentWeatherData.weather[0].icon,
      currentWeatherData.weather[0].description,
      tempF,  // Set the temperature in Fahrenheit
      currentWeatherData.main.humidity,
      currentWeatherData.wind.speed
    );
  }
  

  // Build a forecast array for the next 5 days
// Build a forecast array for the next 5 days, skipping over the same day and using only one forecast per day
// Build a forecast array for the next 5 days, skipping today
private buildForecastArray(cityName: string, weatherData: any[]): Weather[] {
  const daysProcessed: Set<string> = new Set(); // Track days already added
  const forecastArray: Weather[] = [];

  // Get today's date to skip it
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  for (const forecast of weatherData) {
    const date = forecast.dt_txt.split(' ')[0]; // Extract just the date (YYYY-MM-DD)

    // Skip today's date and ensure we only include one forecast per day
    if (date !== today && !daysProcessed.has(date)) {
      // Convert temperature from Celsius to Fahrenheit
      const tempF = (forecast.main.temp * 9/5) + 32;

      // Create the Weather object and add to forecast array
      const weather = new Weather(
        cityName,
        forecast.dt_txt,
        forecast.weather[0].icon,
        forecast.weather[0].description,
        tempF,  // Pass the temperature in Fahrenheit
        forecast.main.humidity,
        forecast.wind.speed
      );

      forecastArray.push(weather);
      daysProcessed.add(date); // Mark this day as processed
    }

    // Stop when we have 5 distinct days in the forecast
    if (forecastArray.length === 5) {
      break;
    }
  }

  // Debugging: Log the forecast array to check the output
  console.log('Final 5-day forecast (starting from tomorrow):', forecastArray);

  return forecastArray;
}




  // Public method to get weather data for a city
// Ensure the 'currentWeather' is not undefined and handle potential API failures
public async getWeatherForCity(city: string): Promise<{ currentWeather: Weather; forecast: Weather[], timezone: number }> {
  try {
    const coordinates = await this.fetchLocationData(city);
    const weatherData = await this.fetchWeatherData(coordinates);

    if (!weatherData || !weatherData.city || !weatherData.list) {
      throw new Error('Invalid weather data received from API');
    }

    const cityName = weatherData.city.name;
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecast = this.buildForecastArray(cityName, weatherData.list);
    const timezone = weatherData.city.timezone;

    return { currentWeather, forecast, timezone };
  } catch (error) {
    console.error('Error fetching weather for city:', error);  // This will log the error in server logs
    throw new Error('Error fetching weather for the requested city');
  }
}
}

export default new WeatherService();
