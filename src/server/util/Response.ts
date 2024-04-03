export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500
} as const;

interface ErrorObject extends Error {
  errorCode: string;
  message: string;
  stack?: Error['stack'];
  cause?: Error['cause'];
}

export class Response<BodyType> {
  body: BodyType | null;
  statusCode: number;
  statusMessage: string;
  error?: ErrorObject;

  constructor (body: BodyType) {
    this.body = body ?? null;
    this.statusCode = 200;
    this.statusMessage = 'Success';
  }
}

export class ErrorResponse extends Response<null> {
  constructor ({
    message,
    errorCode
  }: {
    message: string;
    errorCode: string;
  }, statusCode: typeof STATUS_CODES[keyof typeof STATUS_CODES]) {
    super(null);
    this.statusCode = statusCode;
    this.statusMessage = 'Error';
    // Ensure the name of this error is the same as the class name
    this.error = {
      name: this.constructor.name,
      errorCode,
      message
    };
    Error.captureStackTrace(this, this.constructor);
  }
}

Object.setPrototypeOf(ErrorResponse.prototype, Response.prototype);
