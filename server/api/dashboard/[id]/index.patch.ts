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

  const body = await readBody(event);
  const origin = await storage.getItem<Tab.Item[]>('dashboard') || [];
  const updated = Object.assign(origin[targetIndex], body);
  origin.splice(targetIndex, 1, updated);
  await storage.setItem('dashboard', origin);
  return updated;
});
