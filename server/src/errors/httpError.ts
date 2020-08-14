/**
 * User: abhijit.baldawa
 *
 * Exposes custom HttpError to represent errors relating to HTTP communication
 * with remote services
 */

class HttpError extends Error {
    statusCode: number;

    constructor(code: number, message: string) {
      super(message);
      this.statusCode = code;
    }
}

export { HttpError };
