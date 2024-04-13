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
      statusCode: 400,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const widgetId = getRouterParam(event, 'widgetId');
  if (!widgetId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'unknown Widget ID'
    });
  }

  const storage = useStorage('dashboard');
  const { userName } = verifyToken(token.split(' ')[1])!;
  const data = await storage.getItem<Tab.Item[]>(userName) || [];
  const targetIndex = data.findIndex(item => item.id === dashboardId);
  if (targetIndex < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const body = await readBody(event);
  const originDashboard = await storage.getItem<Tab.Item[]>(userName) || [];
  const targetDashboard = originDashboard[targetIndex];
  const originWidgetIdx = targetDashboard.widgets.findIndex(widget => (widget.id === widgetId));
  if (originWidgetIdx < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'unknown Widget ID'
    });
  }

  const widgets = targetDashboard.widgets.map((widget) => {
    if (widget.id !== widgetId) {
      return widget;
    } else {
      return {
        ...widget,
        ...body,
        setting: body.setting
      };
    }
  });
  const updated = { ...targetDashboard, widgets };
  originDashboard.splice(targetIndex, 1, updated);
  await storage.setItem(userName, originDashboard);

  return new Response(updated);
});
