import { Router, Request, Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  console.log(`City received: ${city}`);
  
  try {
    const weather = await WeatherService.getWeatherForCity(city);
    res.json(weather);
  } catch (error) {
    console.error('Error fetching weather data:', error);  // Log the error
    res.status(500).json({ message: 'Error fetching weather data' });
  }
});



// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.status(200).json(cities);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// DELETE city from search history
// Assuming you have something like this
router.delete('/weather/history/:id', async (req, res) => {
  const cityId = req.params.id;

  try {
    // Convert cityId to a number before passing it to removeCity
    await HistoryService.removeCity(Number(cityId)); // Fix by converting to a number
    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city' });
  }
});



export default router;
