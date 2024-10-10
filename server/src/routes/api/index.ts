import { Router } from 'express';
import historyService from '../../service/historyService.js';
import weatherService from '../../service/weatherService.js';

const router = Router();

// Fetch weather history
router.get('/weather/history', async (req, res) => {
  try {
    const history = await historyService.getCities();
    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// Post request to fetch weather by city name and add to history
router.post('/weather', async (req, res) => {
  const { city } = req.body;

  try {
    const weatherData = await weatherService.getWeatherForCity(city);
    await historyService.addCity(city); // Add the searched city to the history
    res.status(200).json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data or save search history' });
  }
});


// Delete a city from search history
router.delete('/weather/history/:id', async (req, res) => {
  const cityId = parseInt(req.params.id, 10); // Ensure the ID is parsed as a number

  try {
    await historyService.removeCity(cityId); // Call the service to remove the city by its ID
    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});



export default router;
