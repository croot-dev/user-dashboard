import { Tab } from '~/types';
import { Response, STATUS_CODES } from '~/server/util/Response';
import { verifyToken } from '~/server/util/token';

export default defineEventHandler(async (event) => {
  const token = event.headers.get('Authorization');
  if (!token) {
    throw createError({
      statusCode: STATUS_CODES.UNAUTHORIZED,
      statusMessage: 'Unauthorized'
    });
  }

  const dashboardId = getRouterParam(event, 'id');
  if (!dashboardId) {
    throw createError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const { userName } = verifyToken(token.split(' ')[1])!;
  const storage = useStorage('dashboard');
  const data = await storage.getItem<Tab.Item[]>(userName) || [];
  const targetIndex = data.findIndex(item => item.id === dashboardId);
  if (targetIndex < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const body = await readBody(event);
  const updated = Object.assign(data[targetIndex], body);
  data.splice(targetIndex, 1, updated);
  await storage.setItem(userName, data);
  return new Response(updated);
});
