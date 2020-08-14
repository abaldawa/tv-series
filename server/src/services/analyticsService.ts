/**
 * User: abhijit.baldawa
 *
 * This module exposes methods which interacts with analyticsModel and sends response
 */

import { SeriesAndTopEpisodes } from './types';
import * as analyticsModel from '../database/models/analyticsModel';

/**
 * @public
 *
 * If the given the series object is found in DB then increments 'accessCount'
 * field by 1 or sets 'accessCount' to 1 and save in DB
 *
 * @param series - series to update or create in DB
 */
const trackBrowsedSeries = (series: SeriesAndTopEpisodes['series']): boolean => {
  const foundSeries = analyticsModel.findSeriesById(series.seriesId);

  if (!foundSeries) {
    return analyticsModel.addNewSeries({ ...series, accessCount: 1 });
  }

  foundSeries.accessCount += 1;
  return analyticsModel.updateSeries(foundSeries);
};

/**
 * @public
 *
 * Given the limit gets most browsed TV series on this server
 *
 * @param limit - number of populate TV shows browsed to get from DB
 */
const getMostBrowsedSeries = (limit: number) => analyticsModel.getMostBrowsedSeries(limit);

export {
  trackBrowsedSeries,
  getMostBrowsedSeries
};
