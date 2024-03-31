import { Tab } from '~/types';

export default defineEventHandler(async (event) => {
  const storage = useStorage('redis');
  const dashboardId = getRouterParam(event, 'id');
  if (!dashboardId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'unknown Dashboard ID'
    });
  }

  const data = await storage.getItem<Tab.Item[]>('dashboard') || [];
  const targetIndex = data.findIndex(item => item.id === dashboardId);
  if (targetIndex < 0) {
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

  const body = await readBody(event);
  const origin = await storage.getItem<Tab.Item[]>('dashboard') || [];
  const widgets = origin[targetIndex].widgets.map(widget => (widget.id !== widgetId) ? widget : Object.assign(widget, body));
  const updated = { ...origin[targetIndex], widgets };
  origin.splice(targetIndex, 1, updated);
  await storage.setItem('dashboard', origin);

  return updated;
});
