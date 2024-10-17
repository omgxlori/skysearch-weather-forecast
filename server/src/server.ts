import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
const cors = require('cors');
import routes from './routes/index.js'; // Assuming routes are set up properly

dotenv.config();

// Define __filename and __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Vercel frontend
app.use(cors({
  origin: 'https://skysearch-weather-forecast.vercel.app', // Vercel frontend URL
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Specify the allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify the allowed headers
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'client/dist' directory
app.use(express.static(path.join(__dirname, '../client/dist')));

// Connect routes (API + HTML routes)
app.use(routes);

// Start the server on the specified port
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
