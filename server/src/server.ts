/* eslint-disable import/first */
/**
 * User: abhijit.baldawa
 *
 * This module initializes all the pre-requisites and then starts the express server
 */

require('dotenv').config();

import express from 'express';
import tvSeriesRouter from './routes/tvSeries.routes';
import analyticsRouter from './routes/analytics.routes';
import logger from './logger/logger';
import { getPort, validate as validateConfig } from './config/config';

const app = express();

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () => {
  validateConfig();
  const PORT = getPort();

  try {
    // ---------------------------- 1. Add express routes ----------------------------------
    app.use('/topEpisodes', tvSeriesRouter);
    app.use('/analytics', analyticsRouter);
    // -------------------------------------- 1. END ---------------------------------------

    // ------------------------------ 2. Start Http Server -------------------------------------------
    await new Promise((resolve, reject) => {
      app
        .listen(PORT, resolve)
        .on('error', reject);
    });

    logger.info(`Server is listening on port = ${PORT}`);
    // --------------------------------- 2. END -------------------------------------------------------
  } catch (err) {
    logger.error(`Error while starting server on port = ${PORT}. Error: ${(err as Error).stack}. Exiting...`);
    process.exit(1);
  }
})();
