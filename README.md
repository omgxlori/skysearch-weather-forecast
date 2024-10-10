# SkySearch Weather Forecast

## Overview
SkySearch Weather Forecast is a weather app that allows users to search for weather information by city. The app displays the current day's weather, including temperature, humidity, wind speed, and an icon representing the current weather conditions. Additionally, it provides a 5-day forecast for each searched city, showing the temperature, humidity, wind speed, and weather icon for each day. The app also stores search history in a searchHistory.json file, using the fs module to save and retrieve past searches.

## Features
- Search weather by city name
- View current weather and a 5-day forecast
- Stores search history in a searchHistory.json file
- Fetches weather data from an external API
- User-friendly interface with responsive design

## Technologies Used
- <b>Node.js:</b> Backend environment for running the app
- <b>Express.js:</b> Web framework for Node.js
- <b>fs module:</b> File system operations to store and retrieve search history
- <b>API:</b> Fetches weather data from a third-party service, specifically OpenWeatherMap API
- <b>JavaScript:</b> Main programming language for building the app
- <b>HTML & CSS:</b> Frontend design and layout

## Installation
1. Clone the repository:
```md
git clone https://github.com/your-username/skysearch-weather-forecast.git
```

2. Navigate to the project directory:
```md
cd skysearch-weather-forecast
```

3. Install the required dependencies:
```md
npm install
```

4. Create an .env file in the root directory and add your API key:
```md
API_KEY=your_openweathermap_api_key
```

## Usage
1. Before starting the server, ensure that both the server-side and client-side applications are properly built:
```md
npm run build
```
Run this command separately in both the server and client directories.

2. After building, start the server in the server directory:
```md
npm run dev
```

3. In a new terminal, navigate to the client directory and start the client side:
```md
npm run dev
```

4. Open a web browser and go to http://localhost:5000.

5. Enter a city name in the search bar to view the weather information.

## Search History
The SkySearch Weather Forecast stores your search history in a searchHistory.json file. To view or modify the search history, open searchHistory.json located in the root of the project folder. The file will store an array of previously searched cities.

## Future Enhancements
- <b>Real-time updates:</b> Automatically refresh weather data at regular intervals for up-to-date information.
- <b>Faster data loading:</b> Optimize API calls and caching to improve loading times and reduce latency.
- <b>User preferences:</b> Allow users to set and save preferences for temperature units (Celsius/Fahrenheit) or default cities.
- <b>Interactive maps:</b> Display a map with the city's location

## Contributing
Feel free to open issues or submit pull requests. Contributions are welcome!

## Support
If you need help using this project or encounter issues, please reach out via the following options:

GitHub Issues: Report bugs or request features by opening an issue in the GitHub repository.
Email: Contact me at lbelovin@gmail.com for any inquiries.
You can also find more of my work at [https://github.com/omgxlori](https://github.com/omgxlori)

## License
This project is licensed under the MIT License. See the LICENSE file for details.