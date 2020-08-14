/**
 * User: abhijit.baldawa
 *
 * This module contains all the routes for "/topEpisodes" endpoints
 */

import { Router } from 'express';
import { getTopEpisodesOfSeriesById } from '../controllers/tvSeries.controller';

const router = Router();

router.get('/:seriesId', getTopEpisodesOfSeriesById);

export default router;
