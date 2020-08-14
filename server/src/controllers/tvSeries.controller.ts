/**
 * User: abhijit.baldawa
 *
 * This module exposes controller method's which are connected to /topEpisodes REST endpoint
 */

import { RequestHandler } from 'express';
import * as tvService from '../services/tvSeriesService';
import { HttpError } from '../errors/httpError';

/**
 * @public
 *
 * @RestEndPoint GET /topEpisodes/:seriesId
 * This controller method responds with max top 20 episodes of a
 * given seriesId
 *
 *  * An example response is as below:
 * {
 *    episodes: [
 *      {
 *         episodeName: string,
 *         averageVotes: number
 *      },
 *      ...
 *    ]
 * }
 *
 *
 * @param _ - express request object
 * @param res - express response object
 */
const getTopEpisodesOfSeriesById: RequestHandler<{seriesId: string}> = async (req, res) => {
  try {
    const { seriesId } = req.params;
    const topEpisodesOfSeries = await tvService.getTopEpisodesOfSeriesById(seriesId);
    res.status(200).json(topEpisodesOfSeries);
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ error: error.message });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
};

export {
  getTopEpisodesOfSeriesById
};
