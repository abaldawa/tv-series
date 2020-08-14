/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/camelcase */
import { getTopEpisodesOfSeriesById } from '../../src/services/tvSeriesService';
import axios, { AxiosResponse } from 'axios';
import { trackBrowsedSeries } from '../../src/services/analyticsService';
import { HttpError } from '../../src/errors/httpError';
import * as tvSeriesData from './mock_data/tvSeries';
import { HttpErrorResponse } from '../../src/http/http';
import * as config from '../../src/config/config';

// 1. Initialize all the pre-requisites
const TV_SERIES_URL_TEMPLATE = config.getTvSeriesUrl();
const TV_SEASONS_URL_TEMPLATE = config.getTvSeasonUrl();
const FAKE_API_KEY = config.getApiKey();

const UNKNOWN_SERIES_ID = 'unknown';
const KNOWN_SERIES_ID = `${tvSeriesData.KNOWN_SERIES_ID}`;

// Initialize all the known URL's which will reach axios.get mock method
const TV_SERIES_URL =  TV_SERIES_URL_TEMPLATE.replace('$tv_id', KNOWN_SERIES_ID).replace('$api_key', FAKE_API_KEY);
const SEASON_ONE_URL = TV_SEASONS_URL_TEMPLATE.replace('$tv_id', KNOWN_SERIES_ID).replace('$season_no', '1').replace('$api_key', FAKE_API_KEY);
const SEASON_TWO_URL = TV_SEASONS_URL_TEMPLATE.replace('$tv_id', KNOWN_SERIES_ID).replace('$season_no', '2').replace('$api_key', FAKE_API_KEY);;

class MockAxiosError<T> {
  response: AxiosResponse<T>;

  constructor(errorObj: AxiosResponse<T>) {
    this.response = errorObj;
  }
}

// 2. Mock the dependent modules which should not be executed
jest.mock('axios');
jest.mock('../../src/services/analyticsService');

describe('#getTopEpisodesOfSeriesById()', () => {
  beforeAll(() => {
    (axios.get as jest.Mock).mockImplementation(async (URL: string) => {
      switch (URL) {
        case TV_SERIES_URL:
          return { data: tvSeriesData.tvSeries };
        case SEASON_ONE_URL:
          return { data: tvSeriesData.seasonOneDetails };
        case SEASON_TWO_URL:
          return { data: tvSeriesData.seasonTwoDetails };
        default:
          throw new MockAxiosError<HttpErrorResponse>({
            status: 404,
            statusText: '',
            config: {},
            headers: {},
            data: {
              status_message: 'The resource you requested could not be found.',
              success: false,
              status_code: 37
            }
          });
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    (trackBrowsedSeries as jest.Mock).mockImplementation(() => {});
  });

  it(`Should throw 'HttpError' with 404 status code and appropriate message if seriesId is not found`, async () => {
    let error: HttpError;
    try {
      await getTopEpisodesOfSeriesById(UNKNOWN_SERIES_ID);
    } catch (e) {
      error = e as HttpError;
    }

    // To be 100% sure that the method threw an exception asserting outside catch
    expect(error! instanceof HttpError).toBe(true);
    expect(error!.statusCode).toBe(404);
    expect(error!.message).toBe(`Error getting details of TV show ID = 'unknown'. Reason: The resource you requested could not be found.`);
  });

  it('Given valid series Id should return maximum top 20 episodes', async () => {
    const topEpisodes = await getTopEpisodesOfSeriesById(KNOWN_SERIES_ID);
    expect(topEpisodes.episodes.length <= 20).toBe(true);
    expect(topEpisodes).toStrictEqual(tvSeriesData.topEpisodes);
  });

  it(`Should call 'analytics.Service.trackBrowsedSeries()' with series details`, async () => {
    expect(trackBrowsedSeries).toBeCalledTimes(1);
    expect(trackBrowsedSeries).toBeCalledWith({ seriesName: 'Game of Thrones', seriesId: +KNOWN_SERIES_ID });
  });
});
