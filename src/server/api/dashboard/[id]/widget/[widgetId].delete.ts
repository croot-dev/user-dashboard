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

  const storage = useStorage('dashboard');
  const dashboardId = getRouterParam(event, 'id');
  if (!dashboardId) {
    throw createError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const widgetId = getRouterParam(event, 'widgetId');
  if (!widgetId) {
    throw createError({
      statusCode: STATUS_CODES.BAD_REQUEST,
      statusMessage: 'unknown Widget ID'
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

  const origin = await storage.getItem<Tab.Item[]>(userName) || [];
  const widgets = origin[targetIndex].widgets.filter(widget => widget.id !== widgetId);
  const updated = { ...origin[targetIndex], widgets };
  origin.splice(targetIndex, 1, updated);
  await storage.setItem(userName, origin);

  return new Response(updated);
});
