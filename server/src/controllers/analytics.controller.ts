/**
 * User: abhijit.baldawa
 *
 * This module exposes controller method's which are connected to /analytics REST endpoint
 */

import { RequestHandler } from 'express';
import * as analyticsService from '../services/analyticsService';

/**
 * @public
 *
 * @RestEndPoint GET /analytics/popularSeries
 * This controller method responds with most browsed TV series on this server
 *
 *  * An example response is as below:
 * [
 *   {
 *     "seriesName": string,
 *     "accessCount": number
 *   }
 *   ...
 * ]
 *
 * or [] if nothing is found
 *
 * @param _ - express request object
 * @param res - express response object
 */
const getMostBrowsedSeries: RequestHandler<{seriesId: string}> = async (_, res): Promise<void> => {
  res.status(200).json(analyticsService.getMostBrowsedSeries(5));
};

export {
  getMostBrowsedSeries
};
