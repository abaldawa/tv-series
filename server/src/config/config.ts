/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to fetch environment variables
 */

/**
 * @public
 *
 * Get port from environment variable or else default to 3000
 * This method returns the port number on which the server should run
 */
const getPort = (): number => (process.env.PORT ? +process.env.PORT : 3000);

/**
 * @public
 *
 * returns the TV_SERIES_URL_TEMPLATE key value from env variables
 */
const getTvSeriesUrl = (): string => process.env.TV_SERIES_URL_TEMPLATE || '';

/**
 * @public
 *
 * returns the TV_SEASONS_URL_TEMPLATE key value from env variables
 */
const getTvSeasonUrl = (): string => process.env.TV_SEASONS_URL_TEMPLATE || '';

/**
 * @public
 *
 * returns the TMDB_API_KEY key value from env variables
 */
const getApiKey = (): string => process.env.TMDB_API_KEY || '';

/**
 * @public
 *
 * Validates whether all the environment variables are set or not
 */
const validate = (): void => {
  const port = getPort();
  if (!port) {
    throw new Error(`'PORT' needs to be set in .env file or 'serverConfig.json'`);
  }

  const tvSeriesUrl = getTvSeriesUrl();
  if (!tvSeriesUrl) {
    throw new Error(`'TV_SERIES_URL_TEMPLATE' key is requred to be set in '.env' file`);
  }

  const tvSeasonUrl = getTvSeasonUrl();
  if (!tvSeasonUrl) {
    throw new Error(`'TV_SEASONS_URL_TEMPLATE' key is requred to be set in '.env' file`);
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error(`'TMDB_API_KEY' key is requred to be set in '.env' file`);
  }
};

export {
  getPort,
  getTvSeriesUrl,
  getTvSeasonUrl,
  getApiKey,
  validate
};
