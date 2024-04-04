import { ErrorResponse, STATUS_CODES } from '~/server/util/Response';
import { generateToken, refreshToken, verifyToken } from '~/server/util/token';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const receivedRefreshToken = body.token;

  if (!receivedRefreshToken) {
    throw new ErrorResponse({
      message: 'Invalid Parameter',
      errorCode: 'undefined'
    }, STATUS_CODES.BAD_REQUEST);
  }

  const token = refreshToken(receivedRefreshToken);
  return { token };
});
