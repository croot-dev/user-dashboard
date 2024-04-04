import { Response, STATUS_CODES } from '~/server/util/Response';
import { verifyToken } from '~/server/util/token';
import { UserInfo } from '~/types/user';

export default defineEventHandler(async (event) => {
  const storage = useStorage('dashboard');
  const token = event.headers.get('Authorization');
  if (!token) {
    throw createError({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      statusMessage: 'Unauthorized'
    });
  }

  const { userName } = verifyToken(token.split(' ')[1])!;

  const data = await storage.getItem(userName);
  return new Response(data);
});
