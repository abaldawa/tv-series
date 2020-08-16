/**
 * User: abhijit.baldawa
 *
 * This module initializes all the pre-requisites and then starts the express server
 */

import express from 'express';
import { getPort, validate as validateConfig } from './config/config';
import tvSeriesRouter from './routes/tvSeries.routes';
import analyticsRouter from './routes/analytics.routes';
import logger from './logger/logger';

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () => {
  try {
    validateConfig();

    const app = express();
    const PORT = getPort();

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
    logger.error(`Error while starting server. Error: ${(err as Error).stack}. Exiting...`);
    process.exit(1);
  }
})();
