import './styles/jass.css';

// * All necessary DOM elements selected
const searchForm: HTMLFormElement = document.getElementById('search-form') as HTMLFormElement;
const searchInput: HTMLInputElement = document.getElementById('search-input') as HTMLInputElement;
const todayContainer = document.querySelector('#today') as HTMLDivElement;
const forecastContainer = document.querySelector('#forecast') as HTMLDivElement;
const searchHistoryContainer = document.getElementById('history') as HTMLDivElement;
const heading: HTMLHeadingElement = document.getElementById('search-title') as HTMLHeadingElement;
const tempEl: HTMLParagraphElement = document.getElementById('temp') as HTMLParagraphElement;
const windEl: HTMLParagraphElement = document.getElementById('wind') as HTMLParagraphElement;
const humidityEl: HTMLParagraphElement = document.getElementById('humidity') as HTMLParagraphElement;

/*

API Calls

*/

// Fetch weather data from the server
const fetchWeather = async (cityName: string) => {
  try {
    const response = await fetch('https://skysearch-weather-forecast.onrender.com/api/weather/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city: cityName }),
    });

    const weatherData = await response.json();

    // Check if currentWeather exists in the response
    if (!weatherData.currentWeather) {
      throw new Error('No current weather data found');
    }

    // Log weather data to see timezone
    console.log('Weather Data:', weatherData);

    // Render weather and forecast using the correct data
    renderCurrentWeather(weatherData.currentWeather, weatherData.timezone);
    renderForecast(weatherData.forecast);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
};

// Fetch search history from the server
const fetchSearchHistory = async () => {
  try {
    const response = await fetch('https://skysearch-weather-forecast.onrender.com/api/weather/history');
    if (!response.ok) throw new Error('Error fetching search history');

    const history = await response.json();
    console.log('Fetched search history:', history); // Log to check the fetched data
    return history;
  } catch (error) {
    console.error('Error fetching search history:', error);
    return []; // Return an empty array if there's an error
  }
};

/*

Render Functions

*/

// Render current weather
const renderCurrentWeather = (currentWeather: any, timezoneOffset: number): void => {
  const { cityName, icon, description, temperature, windSpeed, humidity } = currentWeather;

  // Get the current UTC time and adjust based on the timezone offset
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const localTime = new Date(utcTime + timezoneOffset * 1000);

  // Extract only the date part and format it (MM/DD/YYYY)
  const currentDate = localTime.toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  // Update the heading with city name, date, and weather icon with description as the alt attribute
  heading.innerHTML = `${cityName} (${currentDate}) <img src="https://openweathermap.org/img/w/${icon}.png" alt="${description}" class="weather-icon">`;

  // Set the temperature, wind, and humidity
  tempEl.textContent = `Temp: ${temperature}°F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  // Append the updated elements to the container
  if (todayContainer) {
    todayContainer.innerHTML = ''; // Clear previous data
    todayContainer.append(heading, tempEl, windEl, humidityEl);
  }
};

// Render 5-day forecast
const renderForecast = (forecast: any): void => {
  const headingCol = document.createElement('div');
  const heading = document.createElement('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  if (forecastContainer) {
    forecastContainer.innerHTML = '';
    forecastContainer.append(headingCol);
  }

  // Get today's date and ensure forecast starts from tomorrow (adjust the range as needed)
  const today = new Date();
  const startingDate = new Date(today);
  startingDate.setDate(today.getDate() + 1); // Set starting date to tomorrow

  // Track rendered days to ensure we render the correct 5-day forecast
  let daysRendered = 0;

  for (let i = 0; i < forecast.length; i++) {
    const day = forecast[i];
    const forecastDate = new Date(day.date);

    // Only render forecast days starting from the day after today
    if (forecastDate >= startingDate && daysRendered < 5) {
      renderForecastCard({
        date: day.date,
        icon: day.icon,
        iconDescription: day.description,
        tempF: day.temperature,
        windSpeed: day.windSpeed,
        humidity: day.humidity,
      });
      daysRendered++;
    }
  }
};

// Render a single forecast card
const renderForecastCard = (forecast: any) => {
  const { date, icon, iconDescription, tempF, windSpeed, humidity } = forecast;

  const { col, cardTitle, weatherIcon, tempEl, windEl, humidityEl } = createForecastCard();

  // Convert the forecast date to just the date format "MM/DD/YYYY"
  const forecastDate = new Date(date).toLocaleDateString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });

  // Add content to elements
  cardTitle.textContent = forecastDate;
  weatherIcon.setAttribute('src', `https://openweathermap.org/img/w/${icon}.png`);
  weatherIcon.setAttribute('alt', iconDescription);

  // Set the temperature and weather details
  tempEl.textContent = `Temp: ${tempF.toFixed(1)} °F`;
  windEl.textContent = `Wind: ${windSpeed} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  // Add class for flex styling
  col.classList.add('forecast-card');  // Make sure the forecast card gets the right class
  
  if (forecastContainer) {
    forecastContainer.append(col);
  }
};



// Render search history
const renderSearchHistory = (cities: any[]): void => {
  if (!searchHistoryContainer) return;

  searchHistoryContainer.innerHTML = ''; // Clear previous content

  if (cities.length === 0) {
    searchHistoryContainer.innerHTML = '<p class="text-center">No Previous Search History</p>';
    return;
  }

  // Create buttons for each city
  cities.forEach(city => {
    const cityButton = document.createElement('button');
    cityButton.textContent = city.name;
    cityButton.classList.add('history-btn', 'btn', 'btn-secondary', 'm-1');

    // Handle click event on each city button to re-fetch weather for that city
    cityButton.addEventListener('click', () => {
      fetchWeather(city.name);
    });

    // Create a delete button for each city
    const deleteButton = document.createElement('button');
    deleteButton.classList.add('delete-btn', 'btn', 'btn-danger', 'm-1');
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('data-city', JSON.stringify(city)); // Set city data (including ID) for deletion

    // Handle delete button click event
    deleteButton.addEventListener('click', handleDeleteHistoryClick);

    // Append buttons to the history container
    const cityContainer = document.createElement('div');
    cityContainer.append(cityButton, deleteButton);
    searchHistoryContainer.appendChild(cityContainer);
  });
};


/*

Helper Functions

*/

// Helper to create forecast cards
const createForecastCard = () => {
  const col = document.createElement('div');
  const card = document.createElement('div');
  const cardBody = document.createElement('div');
  const cardTitle = document.createElement('h5');
  const weatherIcon = document.createElement('img');
  const tempEl = document.createElement('p');
  const windEl = document.createElement('p');
  const humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.classList.add('col-auto');
  card.classList.add('forecast-card', 'card', 'text-white', 'bg-primary', 'h-100');
  cardBody.classList.add('card-body', 'p-2');
  cardTitle.classList.add('card-title');
  tempEl.classList.add('card-text');
  windEl.classList.add('card-text');
  humidityEl.classList.add('card-text');

  return {
    col,
    cardTitle,
    weatherIcon,
    tempEl,
    windEl,
    humidityEl,
  };
};

/*

Event Handlers

*/

// Handle form submission
const handleSearchFormSubmit = (event: any): void => {
  event.preventDefault();

  if (!searchInput.value) {
    throw new Error('City cannot be blank');
  }

  const search: string = searchInput.value.trim();
  fetchWeather(search)
    .then(() => {
      getAndRenderHistory(); // Fetch and render updated search history after search
    })
    .catch(error => {
      console.error('Error fetching weather or rendering history:', error);
    });

  searchInput.value = ''; // Clear the input field
};


// Handle search history click events
const handleSearchHistoryClick = (event: any) => {
  if (event.target.matches('.history-btn')) {
    const city = event.target.textContent;
    fetchWeather(city).then(getAndRenderHistory);
  }
};


// Handle delete history click events
const handleDeleteHistoryClick = async (event: any): Promise<void> => {
  event.stopPropagation(); // Prevent other event listeners from being triggered

  const cityID = JSON.parse(event.target.getAttribute('data-city')).id; // Parse the ID from the button's data attribute

  try {
    // Send DELETE request to the server
    const response = await fetch(`https://skysearch-weather-forecast.onrender.com/api/weather/history/${cityID}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete city');
    }

    // Fetch and render the updated search history after deletion
    const updatedHistory = await fetchSearchHistory();
    renderSearchHistory(updatedHistory); // Ensure the updated history is rendered after deletion
  } catch (error) {
    console.error('Error deleting city:', error);
  }
};


/*

Initial Render

*/

// Fetch and render search history
const getAndRenderHistory = () => {
  fetchSearchHistory()
    .then(renderSearchHistory)
    .catch(error => {
      console.error('Error rendering search history:', error);
    });
};

// Add event listeners if elements exist
if (searchForm) {
  searchForm.addEventListener('submit', handleSearchFormSubmit);
} else {
  console.error('searchForm element not found');
}

if (searchHistoryContainer) {
  searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);
} else {
  console.error('searchHistoryContainer element not found');
}

// Call getAndRenderHistory after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  getAndRenderHistory();
});
