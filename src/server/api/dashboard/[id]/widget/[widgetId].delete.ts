import { Tab } from '~/types';

export default defineEventHandler(async (event) => {
  const storage = useStorage('fs');
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

  const origin = await storage.getItem<Tab.Item[]>('dashboard') || [];
  const widgets = origin[targetIndex].widgets.filter(widget => widget.id !== widgetId);
  const updated = { ...origin[targetIndex], widgets };
  origin.splice(targetIndex, 1, updated);
  await storage.setItem('dashboard', origin);

  return updated;
});
