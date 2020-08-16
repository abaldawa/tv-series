/**
 * User: abhijit.baldawa
 *
 * This module exposes methods which interacts with analyticsModel and TMDB
 * remote services and sends response
 */

import * as analyticsService from './analyticsService';
import { getJsonFromUrl } from '../http/http';
import {
  TvShowDetails, TvSeasonDetails, SeriesAndTopEpisodes
} from './types';
import { getTvSeasonUrl, getTvSeriesUrl, getApiKey } from '../config/config';

// Setup the URL's and API keys from environment variables
const API_KEY = getApiKey();
const TV_SERIES_URL_TEMPLATE = getTvSeriesUrl().replace('$api_key', API_KEY);
const TV_SEASONS_URL_TEMPLATE = getTvSeasonUrl().replace('$api_key', API_KEY);

/**
 * @private
 *
 * Returns the top episodes (max 20) and series information from TMDB
 * REST api'
 *
 * @param seriesId
 */
const getSeriesAndTopEpisodes = async (seriesId: string): Promise<SeriesAndTopEpisodes> => {
  const tvSeriesUrl = TV_SERIES_URL_TEMPLATE.replace('$tv_id', seriesId);
  const tvSeasonUrlTemplate = TV_SEASONS_URL_TEMPLATE.replace('$tv_id', seriesId);

  const tvSeriesObj = await getJsonFromUrl<TvShowDetails>(tvSeriesUrl, `Error getting details of TV show ID = '${seriesId}'`);

  // Issue all requests to get all season details parallelly to speed up the operation
  const allEpisodes = await Promise.all(tvSeriesObj.seasons.map(async (season) => {
    if (season.season_number === 0) {
      return;
    }

    const seasonDetails = await getJsonFromUrl<TvSeasonDetails>(
      tvSeasonUrlTemplate.replace('$season_no', `${season.season_number}`),
      `Error getting details of season - ${season.season_number} for TV show ID = '${seriesId}'`
    );
    return seasonDetails.episodes.map((episode) => {
      if (typeof episode.vote_average !== 'number') {
        return;
      }

      return {
        episodeName: episode.name,
        averageVotes: episode.vote_average
      };
    });
  }));

  const topEpisodes = (allEpisodes.filter(Boolean) as SeriesAndTopEpisodes['episodes'][])
    .flat(1)
    .sort((a, b) => b.averageVotes - a.averageVotes)
    .slice(0, 20);

  return {
    episodes: topEpisodes,
    series: {
      seriesName: tvSeriesObj.name,
      seriesId: tvSeriesObj.id
    }
  };
};

/**
 * @public
 *
 * Returns top episodes (max 20) from TMDB rest API's and tracks the
 * requested series using the analytics service
 *
 * @param seriesId - series to Get data from TMDB API's
 */
const getTopEpisodesOfSeriesById = async (seriesId: string): Promise<{episodes: SeriesAndTopEpisodes['episodes']}> => {
  const seriesAndTopEpisodes = await getSeriesAndTopEpisodes(seriesId);
  analyticsService.trackBrowsedSeries(seriesAndTopEpisodes.series);
  return { episodes: seriesAndTopEpisodes.episodes };
};

export {
  getTopEpisodesOfSeriesById
};
