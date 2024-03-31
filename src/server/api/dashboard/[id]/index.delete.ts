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

  const deleted = data.splice(targetIndex, 1);
  await storage.setItem('dashboard', data);
  return deleted;
});
