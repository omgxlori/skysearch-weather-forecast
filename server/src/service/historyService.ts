import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Use import.meta.url to get the current file URL, then create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Now define the correct path to your searchHistory.json file
const filePath = path.join(__dirname, '../../db/searchHistory.json');

class HistoryService {
  // Read all cities from the JSON file
  public async getCities() {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Add a city to the search history
public async addCity(city: any) {
  try {
    const cities = await this.getCities(); // Get existing cities
    const newCity = { id: Date.now(), name: city }; // Create a new city object with a unique ID

    // Check if city already exists in the history
    if (!cities.find((existingCity: any) => existingCity.name === city)) {
      cities.push(newCity); // Add new city to the list
      await fs.writeFile(filePath, JSON.stringify(cities, null, 2)); // Save to file
      console.log('City added to search history:', newCity);
    } else {
      console.log('City already exists in the search history.');
    }
  } catch (error) {
    console.error('Error adding city to search history:', error);
    throw new Error('Error saving city');
  }
}


// Remove a city by its ID
public async removeCity(id: number) {
  try {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city: any) => city.id !== id); // Filter out the city to delete
    await fs.writeFile(filePath, JSON.stringify(updatedCities, null, 2)); // Write the updated list to file
    console.log('City deleted from search history:', id);
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    throw new Error('Error deleting city');
  }
}
}

export default new HistoryService();
