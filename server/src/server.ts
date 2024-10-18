import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Using the correct import syntax for ES modules
import routes from './routes/index.js'; // Your route setup

dotenv.config();

// Define __filename and __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for your Vercel frontend
/* app.use(cors({
  origin: 'https://skysearch-weather-forecast.vercel.app', // Allow requests from your Vercel frontend
  methods: ['GET', 'POST', 'DELETE', 'PUT'], // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow necessary headers
  optionsSuccessStatus: 204, // Handle preflight responses properly
})); */

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'client/dist' directory
app.use(express.static('../client/dist'));

// Connect routes (API + HTML routes)
app.use(routes);

// Start the server
app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`));
