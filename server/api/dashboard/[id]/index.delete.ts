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

  const origin = await storage.getItem<Tab.Item[]>('dashboard') || [];
  const deleted = origin.splice(targetIndex, 1);
  await storage.setItem('dashoard', origin);
  return deleted;
});
