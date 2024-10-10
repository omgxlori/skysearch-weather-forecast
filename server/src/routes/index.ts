import { Router } from 'express';
import apiRoutes from './api/index.js';

const router = Router();

router.use('/api', apiRoutes); // This will ensure that '/api/weather/history' is accessible

export default router;
