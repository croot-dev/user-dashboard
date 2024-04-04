import { Tab } from '~/types';
import { ErrorResponse, STATUS_CODES } from '~/server/util/Response';
import { verifyToken } from '~/server/util/token';
import { UserInfo } from '~/types/user';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const token = event.headers.get('Authorization');
  if (!token) {
    throw createError({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      statusMessage: 'Unauthorized'
    });
  }

  const storage = useStorage('dashboard');
  const dashboardId = getRouterParam(event, 'id');
  if (!dashboardId) {
    throw createError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      statusMessage: 'unknown Dashboard ID'
    });
  }
  const { userName } = verifyToken(token.split(' ')[1])!;

  const data = await storage.getItem<Tab.Item[]>(userName) || [];
  const targetIndex = data.findIndex(item => item.id === dashboardId);
  if (targetIndex < 0) {
    throw createError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const deleted = data.splice(targetIndex, 1);
  await storage.setItem(userName, data);
  return deleted;
});
