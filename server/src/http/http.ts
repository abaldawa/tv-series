/**
 * User: abhijit.baldawa
 *
 * This module exposes method's to get data from remote services
 */

import axios, { AxiosError } from 'axios';
import { HttpError } from '../errors/httpError';

type HttpErrorResponse = {
    success: boolean;
    status_code: number;
    status_message: string;
};

/**
 * @public
 * @param URL - endpoint from which to get data
 * @param errorContext - Message to prepend to error message incase anything goes wrong
 */
const getJsonFromUrl = async <T>(URL: string, errorContext: string): Promise<T> => {
  try {
    const response = await axios.get<T>(URL);
    return response.data;
  } catch (err) {
    const { response } = err as AxiosError<HttpErrorResponse>;

    if (response) {
      const { status, data } = response;
      throw new HttpError(status, `${errorContext}. Reason: ${data.status_message}`);
    } else {
      throw new HttpError(500, `${errorContext}. Reason: ${err}`);
    }
  }
};

export {
  HttpErrorResponse,
  getJsonFromUrl
};
