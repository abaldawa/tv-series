/**
 * User: abhijit.baldawa
 *
 * This module exposes methods to perform CRUD operations on analytics collection
 */

// -------------------------- Define types --------------------------
type Series = {
    seriesName: string;
    seriesId: number;
};

type TrackedSeries = Series & {accessCount: number}
// ---------------------------------- Types End ----------------------------------

// Using in-memory array as database
const db: TrackedSeries[] = [];

/**
 * @public
 *
 * Find the series by Id from the database
 *
 * @param seriesId - seriesId to find from the database
 */
const findSeriesById = (seriesId: number): TrackedSeries | undefined => {
  const foundSeries = db.find((seriesObj) => seriesObj.seriesId === seriesId);
  if (!foundSeries) {
    return;
  }
  return { ...foundSeries };
};

/**
 * @public
 *
 * Insert seriesObject into the database
 *
 * @param seriesToAdd - series to add to the database
 */
const addNewSeries = (seriesToAdd: TrackedSeries): boolean => {
  db.push(seriesToAdd);
  return true;
};

/**
 * @public
 *
 * If the 'seriesToUpdate' object is found in DB then it is updated
 *
 * @param seriesToUpdate - series object to update
 */
const updateSeries = (seriesToUpdate: TrackedSeries): boolean => {
  const foundIndex = db.findIndex((seriesObj) => seriesObj.seriesId === seriesToUpdate.seriesId);

  if (foundIndex !== -1) {
    db.splice(foundIndex, 1, seriesToUpdate);
    return true;
  }
  return false;
};

/**
 * @public
 *
 * Given the 'limit' count this method returns the most browsed series list
 * based on 'accessCount' field in database respecting the 'limit' param passed
 *
 * @param limit - Maximum top viewed series to retreive
 */
const getMostBrowsedSeries = (limit: number): {seriesName: string; accessCount: number}[] => db
  .sort((a, b) => b.accessCount - a.accessCount)
  .slice(0, limit)
  .map((trackedSeries) => ({ seriesName: trackedSeries.seriesName, accessCount: trackedSeries.accessCount }));

export {
  findSeriesById,
  addNewSeries,
  updateSeries,
  getMostBrowsedSeries
};
