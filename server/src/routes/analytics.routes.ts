/**
 * User: abhijit.baldawa
 *
 * This module contains all the routes for "/analytics" endpoints
 */

import { Router } from 'express';
import { getMostBrowsedSeries } from '../controllers/analytics.controller';

const router = Router();

router.get('/popularSeries', getMostBrowsedSeries);

export default router;
